import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { RoomStatus } from 'App/Enums/Room'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('code', 100).notNullable()
      table.text('description').nullable()
      table.enum('status', Object.values(RoomStatus))
        .defaultTo(RoomStatus.ACTIVE)
        .notNullable()

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
