import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import { toNumber } from 'lodash'
import MessageService from 'App/Services/MessageService'
import StoreValidator from 'App/Validators/Message/StoreValidator'
import { MessageStatus } from 'App/Enums/Message'
import { IMessage } from 'App/Repositories/Message/MessageRepositoryInterface'

@inject()
export default class MessagesController {
  constructor(protected messageService: MessageService) {
  }

  public async index({ request, response }: HttpContextContract) {
    const query = request.only(['limit', 'page', 'conversationId'])

    if (!query.conversationId) {
      return response.status(200).json({
        status: false,
        message: 'failed',
        data: [],
      })
    }

    const messages = await this.messageService.listByConversationId(query.conversationId, query)

    return response.status(200).json({
      status: true,
      message: 'success',
      data: messages,
    })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const { content, conversationId } = await request.validate(StoreValidator)

    const params: IMessage.DTO.Store = {
      content,
      conversationId,
      senderId: toNumber(auth.user?.id),
      status: MessageStatus.SENT,
    }

    const message = await this.messageService.store(params)

    return response.status(200).json({
      status: true,
      message: 'success',
      data: message,
    })
  }
}
