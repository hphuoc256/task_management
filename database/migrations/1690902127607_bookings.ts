import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { BookingRepeat, BookingStatus } from 'App/Enums/Booking'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('room_id')
        .unsigned()
        .references('id')
        .inTable('rooms')
        .onDelete('CASCADE')
      table.dateTime('start_at', { useTz: true }).notNullable()
      table.dateTime('end_at', { useTz: true }).notNullable()
      table.string('name').notNullable().comment('representative name')
      table.integer('phone').notNullable().comment('representative phone')
      table.string('department').nullable()
      table.enum('repeat', Object.values(BookingRepeat))
        .defaultTo(BookingRepeat.NOT_REPEAT)
        .nullable()
      table.enum('status', Object.values(BookingStatus))
        .defaultTo(BookingStatus.PENDING)
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
