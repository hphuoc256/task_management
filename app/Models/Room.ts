import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, scope } from '@ioc:Adonis/Lucid/Orm'
import Booking from 'App/Models/Booking'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public description?: string

  @column()
  public status?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * ------------------------------------------------------
   * Relationship
   * ------------------------------------------------------
   */
  @hasMany(() => Booking, {
    localKey: 'id',
  })
  public bookings: HasMany<typeof Booking>

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static searchQueryScope = scope((query, search) => {
    const fields = ['name', 'code', 'description']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} like '%${search}%'`),
    )

    return query.whereRaw(`(${sql})`)
  })
}
