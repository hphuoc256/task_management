import Message from 'App/Models/Message'
import { DatabaseQueryBuilderContract, SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'
import BaseInterface from 'App/Repositories/BaseInterface'

export namespace IMessage {
  export interface Repository extends BaseInterface<typeof Message> {
    listByConversationId(conversationId: number, query: DTO.List): Promise<SimplePaginatorContract<DatabaseQueryBuilderContract>>

    store(params: DTO.Store): Promise<Message>
  }

  export namespace DTO {
    export type List = {
      page: number
      limit: number
    }

    export type Store = {
      content: string
      conversationId: number
      senderId: number
      status: string
    }

  }
}
