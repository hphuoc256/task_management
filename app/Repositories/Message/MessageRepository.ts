import { IMessage } from 'App/Repositories/Message/MessageRepositoryInterface'
import Message from 'App/Models/Message'
import Database, { DatabaseQueryBuilderContract, SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'
import BaseRepository from 'App/Repositories/BaseRepositoryInterface'

export default class MessageRepository
  extends BaseRepository<typeof Message>
  implements IMessage.Repository {
  constructor() {
    super(Message)

  }

  public async listByConversationId(
    conversationId: number,
    query: IMessage.DTO.List,
  ): Promise<SimplePaginatorContract<DatabaseQueryBuilderContract>> {
    return Database
      .from('messages')
      .where('conversation_id', conversationId)
      .leftJoin('users', 'users.id', '=', 'messages.sender_id')
      .select('messages.*', 'users.username as sender_username', 'users.username as sender_email')
      .orderBy('created_at', 'desc')
      .paginate(query.page, query.limit)
  }

  public async store(params: IMessage.DTO.Store): Promise<Message> {
    return await Message.create(params)
  }
}
