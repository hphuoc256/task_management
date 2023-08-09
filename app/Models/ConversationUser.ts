import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ConversationUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public conversationId: number

  @column()
  public userId: number
}
