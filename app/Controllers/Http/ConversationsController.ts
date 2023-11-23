import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import ConversationService from 'App/Services/ConversationService'
import { toNumber } from 'lodash'
import StoreValidator from 'App/Validators/Conversation/StoreValidator'
import { IConversation } from 'App/Repositories/Conversation/ConversationRepositoryInterface'
import { ApiResponse } from 'App/Utils/ApiResponse'

@inject()
export default class ConversationsController {
  constructor(
    protected conversationService: ConversationService,
  ) {
  }

  public async index({ response, request, auth }: HttpContextContract) {
    try {
      let query = request.only(['limit', 'page'])
      const filter: IConversation.DTO.List = {
        page: toNumber(query?.page || 1),
        limit: toNumber(query?.limit || 10),
      }
      const conversations = await this.conversationService.getByUserId(toNumber(auth.user?.id), filter)

      return ApiResponse.success(response, conversations)
    } catch (e) {
      return ApiResponse.error(response, [])
    }
  }

  public async detail({ request, response, auth }: HttpContextContract) {
    const conversationId = request.params()?.id

    const conversation = await this.conversationService.detailConversationByUserId(toNumber(auth.user?.id), conversationId)

    if (!conversation)
      return ApiResponse.error(response, 40)
    return ApiResponse.success(response, conversation)

  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const { participants, type, name } = await request.validate(StoreValidator)

      const params: IConversation.DTO.ConversationStore = {
        participants, type,
        name: name || null,
        userId: toNumber(auth.user?.id),
      }

      const conversation = await this.conversationService.store(params)

      if (!conversation)
        return ApiResponse.error(response, [], 42)
      return ApiResponse.success(response, [])
    } catch (e) {
      console.log(e)
      return ApiResponse.error(response, e?.messages?.errors || [], 422)
    }
  }
}
