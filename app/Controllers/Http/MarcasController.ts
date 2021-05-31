import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Marca from 'App/Models/Marca'

export default class MarcasController {
  
    async registrarMarca({ request, auth, response }:HttpContextContract) {
        
        console.log('here')
        const validation = await schema.create({
            nombre: schema.string({}, [
                rules.required()
            ])
        });
        const messages = {
            "required": "Es necesario llenar el campo del nombre",
        };
        const validate = await request.validate({
            schema: validation,
            messages: messages
        });
        const marca = new Marca();
        marca.account_id = auth.user!.id;
        marca.name = validate.nombre;
        await marca.save();

        console.log(marca)
        return response.json({
            status: 'sure',
            message: 'Registrado',
            data: marca
        });
    }

    async eliminarMarca({ params, auth, response }) {
        const marca = await Marca.findBy('id', params.id);
        if (marca == null) {
            return response.status(404).json({
                status: 'Not found',
                message: 'Este producto ya ha sido eliminado'
            });
        }
        if (marca.account_id == auth.user.id) {
            await marca.delete();
        }
    }
}
