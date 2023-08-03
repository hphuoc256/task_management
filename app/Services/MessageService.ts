import { inject } from '@adonisjs/fold'
import MessageRepository from 'App/Repositories/Message/MessageRepository'
import { toNumber } from 'lodash'
import SocketEvent from 'App/Events/SocketEvent'
import { IMessage } from 'App/Repositories/Message/MessageRepositoryInterface'

@inject()
export default class MessageService {
  constructor(
    protected repo: MessageRepository,
    protected socketEvent: SocketEvent,
  ) {
  }

  public async listByConversationId(conversationId: number, query) {
    const filter = {
      limit: toNumber(query?.limit || 20),
      page: toNumber(query?.page || 1),
    }
    return await this.repo.listByConversationId(conversationId, filter)
  }

  public async store(params: IMessage.DTO.Store): Promise<boolean> {
    const message = await this.repo.store(params)

    if (message) {
      this.socketEvent.sendChat(message.conversationId.toString(), message)
    }

    return !!message
  }
}
