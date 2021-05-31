import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Departament from './Departament'
import Marca from './Marca'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public account_id : number;

  @column()
  public marca_id : number;

  @column()
  public departament_id : number; 

  @column()
  public product_name : string;

  @column()
  public codigo_de_barras : number;

  @column()
  public precio1 : number; 

  @column()
  public precio2 : number;
 
  @column()
  public costo : number;

  @column()
  public especificaciones : string;

  @column()
  public image : string;
    
  @column()
  public existencias : number;


  @belongsTo( () => Account )
  public account : BelongsTo<typeof Account>


  @belongsTo( () => Departament )
  public departament : BelongsTo<typeof Departament>

  @column()
  public precio : number

  @column()
  precio_segundo : number

  @belongsTo( () => Marca )
  public marca : BelongsTo<typeof Marca>


}
