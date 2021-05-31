import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Caja from 'App/Models/Caja'
import Log from 'App/Models/Log'
import Product from 'App/Models/Product'

import { rules, schema } from '@ioc:Adonis/Core/Validator'


export default class CajasController {
    async venta({ auth, request, response } : HttpContextContract){
        
        const sellValidation = await schema.create({
            products : schema.array().members(schema.object().members({
                id : schema.number(),
                cantidad: schema.number(),
                name: schema.string()
            })),
            cantidad : schema.number()
        })

        
        const validate = await request.validate({
            schema: sellValidation,
        })
        
        let errorType : boolean | string = false
        let errorId = 0

        for( let i = 0; i < validate.products.length; i++){
            
            const product = await Product.findBy('id', validate.products[i].id)
            
            if(product == null || product.existencias < validate.products[i].cantidad){
                errorType = validate.products[i].name
                errorId = validate.products[i].id
                break;
            }

            if(auth.user?.id == product.account_id){
                
                product.existencias= product.existencias - validate.products[i].cantidad
                await product.save()

                const log = new Log()
                log.account_id = auth.user?.id
                log.event = `Se vendieron 
                    ${validate.products[i].cantidad} de ${validate.products[i].name}`
                
                await log.save()
            }
            
        }
       
        if(typeof(errorType) == 'string' ){
            return response.status(404).json({
                message : `El producto ${errorType} ya no existe en el inventario o esta agotado`,
                errorId : errorId
            })
        } 

        const caja = await Caja.findBy('account_id', auth.user?.id)
        
        if(caja !== null && caja.account_id == auth.user?.id){
            caja.importe = caja.importe + validate.cantidad
            await caja.save()
        }

        return response.json({
            status: 'sure',
            data: 'Evento registrado'
        })
    }
}
