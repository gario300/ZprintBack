import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Account from 'App/Models/Account'
import PasswordRecuperation from 'App/Models/PasswordRecuperation'
import randomstring from 'randomstring'
import nodemailer from 'nodemailer'
import Caja from 'App/Models/Caja'
import Cajafuerte from 'App/Models/Cajafuerte'

const mail = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'mammonzprint@gmail.com',
      pass: 'tyutyu321'
    }
});

export default class AccountsController {

  async newAccount({auth, request, response}: HttpContextContract){

    const userValidation = await schema.create({
      store_name: schema.string({},[
        rules.alpha({
          allow: ['space']
        }),
        rules.maxLength(20),
        rules.minLength(5),
        rules.required()
      ]),
      email: schema.string({},[
        rules.email(),
        rules.required(),
        rules.unique({
          table: 'accounts',
          column: 'email',
        })
      ]),
      name: schema.string({},[
        rules.alpha(),
        rules.maxLength(25),
        rules.minLength(4),
        rules.required()
      ]),
      password: schema.string({}, [
        rules.maxLength(30),
        rules.minLength(8),
        rules.confirmed('password_confirmation'),
        rules.required(),
      ]),
      password_confirmation: schema.string({}, [
        rules.confirmed('password')
      ])
    })

    const messages = {
      "required" : "Porfavor llena todos los campos correctamente",
      "store_name.alpha" : "Nombre de la cuenta no puede contener numeros o caracteres especiales",
      "store_name.maxLength" : "Nombre de la cuenta no puede ser mayor a 20 caracteres",
      "store_name.minLength" : "Nombre de la cuenta no puede ser menor a 5 caracteres",
      "email" : "Por favor, introduce una dirección de correo valida",
      "name.minLength" : "Nombre no debe ser menor a 4 caracteres",
      "name.maxLength" : "Nombre no debe ser mayor a 25 caracteres",
      "password.minLength" : "Contraseña no debe ser menor a 8 caracteres",
      "password.maxLength" : "Contraseña no puede ser mayor a 30 caracteres",
      "confirmed" : "Las contraseñas no coinciden",
      "unique" : "Esta dirección de email ya está registrada"
    }

    const validate = await request.validate({
      schema: userValidation,
      messages: messages
    })

    const account = new Account()
    for(const key in validate){
      account[key] = validate[key]
    }

    await account.save()

    const caja = new Caja()
    caja.account_id = account.id
    caja.importe = 0  
    await caja.save()

    const cajafuerte = new Cajafuerte()
    cajafuerte.account_id  = account.id 
    cajafuerte.importe = 0  
    await cajafuerte.save()
    

    const token = await auth.attempt(validate.email, validate.password)

    return response.json({
      status: 'sure',
      data: token
    })
  }

  async login({auth, request, response}: HttpContextContract){
    const newSchema = schema.create({
      email: schema.string({},[
        rules.email(),
        rules.required()
      ]),
      password: schema.string({}, [
        rules.maxLength(30),
        rules.minLength(8),
        rules.required(),
      ])
    })

    const validate = await request.validate({
      schema: newSchema,
      messages:{
        "required" : "Porfavor, rellena los datos correctamente"
      }
    })

    try{

      const token = await auth.attempt(validate.email, validate.password)

      return response.json({
        status: 'sure',
        data: token
      })

    }catch(error){
      return response.status(401).json({
        status: 'wrong',
        message: 'Email o Contraseña incorrectos'
      })
    }

  }

  async requestNewPassword({request, response}: HttpContextContract){
   const newSchema = schema.create({
    email: schema.string({},[
      rules.email(),
      rules.required()
    ])
   })


    const validate = await request.validate({
      schema: newSchema,
      messages:{
        "required" : "Porfavor, rellena los datos correctamente"
      }
    })

    const findAccount = await Account.findBy('email', validate.email)

     if(findAccount == null){
      return response.status(401).json({
        status: 'wrong',
        message: 'Esta dirección de correo no pertenece a ninguna cuenta'
      })
     }

    let codeId : string = randomstring.generate({
      length: 12,
      charset: 'hex'
    });

    let findCodeId  = await PasswordRecuperation.findBy('request_random_id', codeId)

    while(findCodeId !== null){
      codeId =  randomstring.generate({
        length: 12,
        charset: 'hex'
      });

      findCodeId  = await PasswordRecuperation.findBy('request_random_id', codeId)
    }

    findCodeId = await PasswordRecuperation.findBy('account_id', findAccount.id)

    if(findCodeId !== null){
      await findCodeId.delete()
    }

    const newRequestRecuperation = new PasswordRecuperation()
    newRequestRecuperation.account_id = findAccount.id
    newRequestRecuperation.request_random_id = codeId
    await newRequestRecuperation.save()



    const mailOptions = {
    from: 'mammonzprint@gmail.com',
      to: validate.email,
      subject: 'Recuperación de contraseña',
      text: `Recupere su contraseña en http://zprint.herokuapp.com/NuevaContrasena?code=${codeId}`
    };


    mail.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ');
      }
    });

    return response.json({
      status: 'sure',
      data: 'Hemos enviado instrucciones a su dirección de email para ayudarle a recuperar su contraseña'
    })

  }

  async reestablecerPassword({params, response}:HttpContextContract){
    const findCode = await PasswordRecuperation.findBy('request_random_id', params.code)


    if(findCode == null){
      return response.status(404).json({
        status:'not found',
        message: 'Lo sentimos este vinculo ha caducado'
      })
    }

    const codeId : string = randomstring.generate({
      length: 8,
      charset: 'hex'
    });

    const user = await Account.findBy('id', findCode.account_id)

    user!.password =  codeId
    await user!.save()

    const mailOptions = {
    from: 'mammonzprint@gmail.com',
      to: user!.email,
      subject: 'Su nueva contraseña',
      text: `Su contraseña para acceder a los servicios de mammon es: ${codeId}`
    };


    mail.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ');
      }
    });

    return response.json({
      status: 'sure',
      data: 'Su nueva contraseña ha sido enviada por email'
    })
  }

}
