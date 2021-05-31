import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, HasMany, beforeSave, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';
import PasswordRecuperation from './PasswordRecuperation'
import User from './User'
import Product from './Product'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public store_name : string;

  @column({ serializeAs: null })
  public password : string;

  @column()
  public email : string;

  @column()
  public name : string

  @column()
  public last_name : string

  @hasMany( () => User )
  public users : HasMany<typeof User>

  @hasMany( () => Product )
  public products : HasMany<typeof Product>

  @hasOne( ()=> PasswordRecuperation)
  public passwordrequest : HasOne<typeof PasswordRecuperation>

  @beforeSave()
  public static async hashPassword(account: Account) {
    if (account.$dirty.password) {
     account.password = await Hash.make(account.password);
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
