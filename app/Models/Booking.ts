import { DateTime } from 'luxon'
import { afterFetch, afterPaginate, BaseModel, BelongsTo, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Room from 'App/Models/Room'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public roomId: number

  @column()
  public startAt?: DateTime

  @column()
  public endAt?: DateTime

  @column()
  public name: string

  @column()
  public phone: string

  @column()
  public department?: string

  @column()
  public status?: string

  @column()
  public repeat?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * ------------------------------------------------------
   * Relationship
   * ------------------------------------------------------
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Room)
  public room: BelongsTo<typeof Room>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   * - define auto behaviors
   */
  @afterFetch()
  @afterPaginate()
  public static async loadRelationsOnPaginate(bookings: Array<Booking>): Promise<void> {
    for (const booking of bookings) {
      /*await booking.load('user')*/
      await booking.load('room')
    }
  }

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static searchQueryScope = scope((query, search) => {
    const fields = ['name', 'phone', 'department']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} like '%${search}%'`),
    )

    return query.whereRaw(`(${sql})`)
  })

}
