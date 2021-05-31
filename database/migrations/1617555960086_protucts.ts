import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('account_id').notNullable().unsigned().references('id').inTable('accounts').onDelete('CASCADE')
      table.integer('marca_id').notNullable().unsigned().references('id').inTable('marcas').onDelete('CASCADE')
      table.integer('departament_id').notNullable().unsigned().references('id').inTable('departaments').onDelete('CASCADE')
      table.string('image')
      table.string('product_name')
      table.integer('codigo_de_barras')
      table.float('precio')
      table.float('precio_segundo')
      table.float('costo')
      table.text('especificaciones')
      table.integer('existencias').notNullable().defaultTo(0)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
