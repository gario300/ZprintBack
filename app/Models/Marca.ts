import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
import Product from './Product'

export default class Marca extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
 
  @belongsTo( () => Account )
  public account : BelongsTo<typeof Account>
 
  @hasMany( () => Product )
  public products : HasMany<typeof Product>

  @column()
  public account_id : number;

  @column()
  public name : string;
}
