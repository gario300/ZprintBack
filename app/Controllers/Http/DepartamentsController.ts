// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Departament from 'App/Models/Departament'


export default class DepartamentsController {
    async registrarDepartamento({ request, auth, response }:HttpContextContract) {
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
        const departamento = new Departament;
        departamento.account_id = auth.user!.id;
        departamento.name = validate.nombre;
        await departamento.save();
        return response.json({
            status: 'sure',
            message: 'registrado',
            data: departamento
        });
    }
    async eliminardeparamento({ params, auth, response }) {
        const deparamento = await Departament.findBy('id', params.id);
        if (deparamento == null) {
            return response.status(404).json({
                status: 'Not found',
                message: 'Este producto ya ha sido eliminado'
            });
        }
        if (deparamento.account_id == auth.user.id) {
            await deparamento.delete();
        }
    }
}


