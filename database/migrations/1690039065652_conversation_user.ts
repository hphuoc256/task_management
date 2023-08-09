import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'conversation_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('conversation_id ')
        .unsigned()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE')
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
