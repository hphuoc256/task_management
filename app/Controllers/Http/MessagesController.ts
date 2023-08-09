import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import { toNumber } from 'lodash'
import MessageService from 'App/Services/MessageService'
import StoreValidator from 'App/Validators/Message/StoreValidator'
import { MessageStatus } from 'App/Enums/Message'
import { IMessage } from 'App/Repositories/Message/MessageRepositoryInterface'
import { ApiResponse } from 'App/Utils/ApiResponse'

@inject()
export default class MessagesController {
  constructor(protected messageService: MessageService) {
  }

  public async index({ request, response, auth }: HttpContextContract) {
    let query = request.only(['limit', 'page', 'conversationId'])

    if (!query.conversationId) {
      return ApiResponse.error(response, [])
    }

    const messages = await this.messageService.listByConversationById(
      query.conversationId,
      query,
      toNumber(auth.user?.id),
    )

    if (!messages) {
      return ApiResponse.error(response, [], 40)
    }

    return ApiResponse.success(response, messages)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    await request.validate(StoreValidator).then(async (payload) => {
      const { content, conversationId } = payload
      const params: IMessage.DTO.Store = {
        content,
        conversationId,
        senderId: toNumber(auth.user?.id),
        status: MessageStatus.SENT,
      }

      const message = await this.messageService.store(params)

      if (!message) {
        return ApiResponse.error(response, [], 40)
      }

      return ApiResponse.success(response, [])
    }).catch((error) => {
      return ApiResponse.error(response, error?.messages?.errors, 422)
    })
  }
}
