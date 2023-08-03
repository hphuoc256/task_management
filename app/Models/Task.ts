import { DateTime } from 'luxon'
import { afterFetch, afterPaginate, BaseModel, BelongsTo, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description?: string

  @column()
  public dueDate?: DateTime

  @column()
  public status?: string

  @column()
  public userId: number

  @column()
  public assignId?: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * ------------------------------------------------------
   * Relationship
   * ------------------------------------------------------
   */
  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'userId',
  })
  public userCreate: BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'assignId',
  })
  public userAssign: BelongsTo<typeof User>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   * - define auto behaviors
   */

  @afterFetch()
  @afterPaginate()
  public static async loadRelationsOnPaginate(tasks: Array<Task>): Promise<void> {
    for (const task of tasks) {
      await task.load('userCreate')
      await task.load('userAssign')
    }
  }
  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static searchQueryScope = scope((query, search) => {
    const fields = ['title', 'description']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} like '%${search}%'`),
    )

    return query.whereRaw(`(${sql})`)
  })
}
