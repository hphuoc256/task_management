import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { TaskStatus } from 'App/Enums/Task'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 255).notNullable()
      table.text('description', 'longText').nullable()
      table.dateTime('due_date', { useTz: true }).nullable()
      table.enum('status', Object.values(TaskStatus))
        .defaultTo(TaskStatus.OPEN)
        .notNullable()
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .comment('user create task')
      table.integer('assign_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
