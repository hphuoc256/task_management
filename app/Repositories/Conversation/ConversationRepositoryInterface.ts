import Conversation from 'App/Models/Conversation'
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import BaseInterface from 'App/Repositories/BaseInterface'

export namespace IConversation {
  export interface Repository extends BaseInterface<typeof Conversation> {
    getOne(id: number): Promise<Conversation | null>

    getByEmail(email: string): Promise<Conversation | null>

    getConversationsByUserId(userId: number, params: DTO.List): Promise<ModelPaginatorContract<LucidRow>>

    detailConversationByUserId(userId: number, conversationId: number): Promise<Conversation | null>

    storeTypePrivate(params: DTO.ConversationPrivateStore): Promise<Conversation>

    storeTypeGroup(params: DTO.ConversationStore): Promise<Conversation>

    checkIfConversationExistsBetweenTwoUsers(user1Id, user2Id): Promise<boolean>
  }

  export namespace DTO {
    export type List = {
      page: number
      limit: number
      search?: string
      userId?: number
    }

    export type ConversationPrivateStore = {
      type: string
      participant: number
      userId: number
    }

    export type ConversationStore = {
      name: string | null
      type: string
      participants: number[]
      userId: number
    }
  }
}

