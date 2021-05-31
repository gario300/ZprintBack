import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cajafuertes extends BaseSchema {
  protected tableName = 'cajafuertes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.integer('account_id').notNullable().unsigned().references('id').inTable('accounts')
        table.float('importe')
        table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
