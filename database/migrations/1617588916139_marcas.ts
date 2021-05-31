import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Marcas extends BaseSchema {
  protected tableName = 'marcas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('account_id').unsigned().notNullable().references('id').inTable('accounts')
      table.string('name').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
