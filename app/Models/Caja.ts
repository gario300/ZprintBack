import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'


export default class Caja extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
    
    @column()
    public account_id : number

    @column()
    public importe : number

    @belongsTo(() => Account)
    public account : BelongsTo <typeof Account> 
}
