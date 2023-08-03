import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Conversation from 'App/Models/Conversation'
import ApiToken from 'App/Models/ApiToken'
import Message from 'App/Models/Message'
import Rotation from 'App/Models/Rotation'
import Booking from 'App/Models/Booking'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column({ serializeAs: null })
  public point ?: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * ------------------------------------------------------
   * Relationship
   * ------------------------------------------------------
   */
  @hasMany(() => ApiToken, {
    localKey: 'id',
  })
  public apiTokens: HasMany<typeof ApiToken>

  @manyToMany(() => Conversation, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'conversation_id',
    pivotTable: 'conversation_user',
  })
  public conversations: ManyToMany<typeof Conversation>

  @hasMany(() => Message, {
    localKey: 'id',
  })
  public messages: HasMany<typeof Message>

  @manyToMany(() => Rotation, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'rotation_id',
    pivotTable: 'rotation_user',
  })
  public rotations: ManyToMany<typeof Rotation>

  @hasMany(() => Booking, {
    localKey: 'id',
  })
  public bookings: HasMany<typeof Booking>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   * - define auto behaviors
   */
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  /*@afterFetch()
  @afterPaginate()
  public static async loadRelationsOnPaginate(users: Array<User>): Promise<void> {
    for (const user of users) await user.load('rotations')
  }*/

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static searchQueryScope = scope((query, search) => {
    const fields = ['username', 'email']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} like '%${search}%'`),
    )

    return query.whereRaw(`(${sql})`)
  })
}
