import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PasswordRecuperations extends BaseSchema {
  protected tableName = 'password_recuperations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('account_id').unsigned().notNullable().references('id').inTable('accounts').onDelete('CASCADE')
      table.string('request_random_id').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
