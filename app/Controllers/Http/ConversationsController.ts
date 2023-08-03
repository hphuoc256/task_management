import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import ConversationService from 'App/Services/ConversationService'
import { toNumber } from 'lodash'
import StoreValidator from 'App/Validators/Conversation/StoreValidator'
import { IConversation } from 'App/Repositories/Conversation/ConversationRepositoryInterface'

@inject()
export default class ConversationsController {
  constructor(
    protected conversationService: ConversationService,
  ) {
  }

  public async index({ response, request, auth }: HttpContextContract) {
    let query = request.only(['limit', 'page'])
    const filter: IConversation.DTO.List = {
      page: toNumber(query?.page || 1),
      limit: toNumber(query?.limit || 10),
    }
    const conversations = await this.conversationService.getConversationsByUserId(toNumber(auth.user?.id), filter)

    return response.status(200).json({
      status: true,
      message: 'success',
      data: conversations,
    })
  }

  public async detail({ request, response, auth }: HttpContextContract) {
    const conversationId = request.params()?.id

    const conversation = await this.conversationService.detailConversationByUserId(toNumber(auth.user?.id), conversationId)

    return response.status(200).json({
      status: true,
      message: 'success',
      data: conversation || {},
    })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const { participants, type, name } = await request.validate(StoreValidator)

    const params: IConversation.DTO.ConversationStore = {
      participants, type,
      name: name || null,
      userId: toNumber(auth.user?.id),
    }

    const conversation = await this.conversationService.store(params)

    if (!conversation) {
      return response.status(200).json({ status: false, message: 'failed', error: [] })
    }
    return response.status(200).json({ status: true, message: 'success', data: [] })
  }
}
