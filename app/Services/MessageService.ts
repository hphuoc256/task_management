import { inject } from '@adonisjs/fold'
import MessageRepository from 'App/Repositories/Message/MessageRepository'
import { toNumber } from 'lodash'
import SocketEvent from 'App/Events/SocketEvent'
import { IMessage } from 'App/Repositories/Message/MessageRepositoryInterface'
import ConversationRepository from 'App/Repositories/Conversation/ConversationRepository'

@inject()
export default class MessageService {
  constructor(
    protected socketEvent: SocketEvent,
    protected repo: MessageRepository,
    protected conversationRepo: ConversationRepository,
  ) {
  }

  public async listByConversationById(
    conversationId: number,
    query: IMessage.DTO.List,
    userId: number,
  ) {
    const conversation = await this.conversationRepo.getOneByUserId(userId, conversationId)
    if (!conversation) return false

    const filter = {
      limit: toNumber(query?.limit || 20),
      page: toNumber(query?.page || 1),
    }
    return await this.repo.listByConversationId(conversationId, filter)
  }

  public async store(params: IMessage.DTO.Store): Promise<boolean> {
    const conversation = await this.conversationRepo.getOneByUserId(params.senderId, params.conversationId)
    if (!conversation) return false

    const message = await this.repo.store(params)

    if (message) {
      this.socketEvent.sendChat(message.conversationId.toString(), message)
    }

    return !!message
  }
}
