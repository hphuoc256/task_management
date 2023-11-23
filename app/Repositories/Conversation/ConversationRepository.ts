import Conversation from 'App/Models/Conversation'
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ConversationType } from 'App/Enums/Conversation'
import BaseRepository from 'App/Repositories/BaseRepositoryInterface'
import { IConversation } from 'App/Repositories/Conversation/ConversationRepositoryInterface'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ConversationRepository
  extends BaseRepository<typeof Conversation>
  implements IConversation.Repository {
  constructor() {
    super(Conversation)
  }

  public async getOne(id: number) {
    return await Conversation.find(id)
  }

  public async getByEmail(email: string) {
    return await Conversation.findBy('email', email)
  }

  public async getManyByUserId(userId: number, filter: IConversation.DTO.List): Promise<ModelPaginatorContract<LucidRow>> {
    const conversations = Conversation.query()
      .select('conversations.*',)
      .preload('userCreate', (builder) => {
        builder.select('username')
      })
      .preload('participants', (builder) => {
        builder.select('username')
      })
      .whereHas('participants', (builder) => {
        builder.where('id', userId)
      })
      .distinct()
      .orderBy('updated_at', 'desc')

    return await conversations.paginate(filter.page, filter.limit)
  }

  public async getOneByUserId(userId: number, conversationId: number): Promise<Conversation | null> {
    const conversation = Conversation.query()
      .where('id', conversationId)
      .whereHas('participants', (builder) => {
        builder.where('id', userId)
      })
      .preload('participants', (builder) => {
        builder.select('username')
      })
      .first()

    return await conversation
  }

  public async storeTypePrivate(params: IConversation.DTO.ConversationPrivateStore): Promise<Conversation> {
    const { type, userId, participant } = params
    const conversation = await Conversation.create({ type, userId })
    conversation.related('participants').attach([userId, participant])

    return conversation
  }

  public async storeTypeGroup(params: IConversation.DTO.ConversationStore): Promise<Conversation> {
    const { type, userId, participants, name } = params
    const conversation = await Conversation.create({ type, userId, name })
    conversation.related('participants').attach([userId, ...participants])

    return conversation
  }

  public async getBetweenTwoUsers(user1Id, user2Id): Promise<boolean> {
    const conversation = await Database
      .from('conversation_user')
      .select('conversation_id')
      .join('conversations', 'conversation_user.conversation_id', 'conversations.id')
      .whereIn('conversation_user.user_id', [user1Id, user2Id])
      .where('conversations.type', ConversationType.PRIVATE)
      .groupBy('conversation_id')
      .havingRaw('COUNT(DISTINCT conversation_user.user_id) = 2')
      .first()

    return !!conversation
  }
}
