import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Departament from 'App/Models/Departament'
import Marca from 'App/Models/Marca'
import Product from 'App/Models/Product'
import Application from '@ioc:Adonis/Core/Application'


const SERVER_HOST = process.env.SERVER_HOST;

export default class ProductsController {
    async agregarProducto({ auth, request, response }:HttpContextContract) {
        const vRules = schema.create({
            marca_id: schema.string({}, [
                rules.required()
            ]),
            departament_id: schema.string({}, [
                rules.required()
            ]),
            product_name: schema.string({}, [
                rules.required(),
            ]),
            codigo_de_barras: schema.number([
                rules.unsigned(),
                rules.required()
            ]),
            precio1: schema.number([
                rules.unsigned(),
                rules.required()
            ]),
            precio2: schema.number([
                rules.unsigned(),
                rules.required()
            ]),
            costo: schema.number([
                rules.unsigned(),
                rules.required()
            ]),
            especificaciones: schema.string({}, [
                rules.required()
            ]),
            existencia: schema.number([
                rules.unsigned(),
                rules.required()
            ]),
            image: schema.file({
                size: '4mb',
                extnames: ['jpg','png'],  
            })
        });
        const messages = {
            "required": "Es necesario llenar todos los campos",
        };
        const validate = await request.validate({
            schema: vRules,
            messages: messages
        });
        const departament = await Departament.query()
            .where('account_id', auth.user!.id)
            .where('name', validate.departament_id)
            .first();
        const marca = await Marca.query()
            .where('account_id', auth.user!.id)
            .where('name', validate.marca_id)
            .first();
        
        const filename : string = JSON.stringify(new Date ())+'_'+auth.user!.name
        await validate.image.move(Application.publicPath(), {
            name: filename+ '.' + validate.image.subtype,
        });


        const product = new Product();
        product.product_name = validate.product_name 
        product.marca_id = marca!.id;
        product.departament_id = departament!.id;
        product.account_id = auth.user!.id;
        product.codigo_de_barras = validate.codigo_de_barras;
        product.precio = validate.precio1;
        product.precio_segundo = validate.precio2;
        product.costo = validate.costo;
        product.especificaciones = validate.especificaciones;
        product.existencias = validate.existencia;
        product.image = SERVER_HOST + filename + '.' + validate.image.subtype;
        await product.save();
        return response.json({
            status: 'sure',
            data: 'Nuevo producto agregado'
        });
    }
    async getProducts({ auth, response, params }) {
        const products = await Product.query()
            .where('account_id', auth.user.id)
            .preload('marca')
            .preload('departament');
        return response.json({
            status: 'sure',
            data: products
        });
    }
    async marcasydepartamentos({ response, auth }:HttpContextContract) {
        const marcas = await Marca.query()
            .where('account_id', auth.user!.id);
        const departaments = await Departament.query()
            .where('account_id', auth.user!.id);
        return response.json({
            status: 'sure',
            marcas: marcas,
            departaments: departaments
        });
    }
}
