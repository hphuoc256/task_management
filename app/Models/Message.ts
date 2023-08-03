import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Conversation from 'App/Models/Conversation'
import User from 'App/Models/User'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public senderId: number

  @column()
  public conversationId: number

  @column()
  public content: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
   * Relationship
   */
  @belongsTo(() => User, {
    localKey: 'senderId',
  })
  public sender: BelongsTo<typeof User>

  @belongsTo(() => Conversation, {
    localKey: 'conversationId',
  })
  public conversation: BelongsTo<typeof Conversation>
}
