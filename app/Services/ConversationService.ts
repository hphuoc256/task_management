import { inject } from '@adonisjs/fold'
import ConversationRepository from 'App/Repositories/Conversation/ConversationRepository'
import { ConversationType } from 'App/Enums/Conversation'
import { first, toNumber } from 'lodash'
import Conversation from 'App/Models/Conversation'
import { IConversation } from 'App/Repositories/Conversation/ConversationRepositoryInterface'

@inject()
export default class ConversationService {
  constructor(
    protected repo: ConversationRepository,
  ) {
  }

  public async getByUserId(userId: number, query) {
    return this.repo.getManyByUserId(userId, query)
  }

  public async detailConversationByUserId(userId: number, conversationId: number): Promise<Conversation | null> {
    return await this.repo.getOneByUserId(userId, conversationId)
  }

  public async store(params: IConversation.DTO.ConversationStore): Promise<boolean> {
    if (params.type === ConversationType.PRIVATE) {
      const userParticipants = first(params.participants)
      const conversationExist = await this.getBetweenTwoUsers(userParticipants, params.userId)
      if (conversationExist) return false

      const dataPrivate = {
        type: params.type,
        userId: params.userId,
        participant: toNumber(first(params.participants)),
      } as IConversation.DTO.ConversationPrivateStore

      const conversation = await this.repo.storeTypePrivate(dataPrivate)

      return !!conversation

    }
    // Check in array exits id auth
    const checkParticipantHaveAuth = params.participants.find(item => item === params.userId)
    const dataGroup = {
      name: params.name,
      type: params.type,
      userId: params.userId,
      participants: checkParticipantHaveAuth ? params.participants.filter(item => item !== params.userId) : params.participants,
    } as IConversation.DTO.ConversationStore

    const conversation = await this.repo.storeTypeGroup(dataGroup)

    return !!conversation
  }

  public async getBetweenTwoUsers(user1Id, user2Id): Promise<boolean> {
    return await this.repo.getBetweenTwoUsers(user1Id, user2Id)
  }

}
