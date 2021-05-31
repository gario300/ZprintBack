import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'
export default class PasswordRecuperation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public account_id : number

  @column()
  public request_random_id : string

  @belongsTo(()=>Account)
  public account : BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
