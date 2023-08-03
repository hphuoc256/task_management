import { container, delay } from 'tsyringe'

import { IUser } from 'App/Repositories/User/UserRepositoryInterface'
import UsersRepository from 'App/Repositories/User/UserRepository'

import { IConversation } from 'App/Repositories/Conversation/ConversationRepositoryInterface'
import ConversationsRepository from 'App/Repositories/Conversation/ConversationRepository'

import { IMessage } from 'App/Repositories/Message/MessageRepositoryInterface'
import MessageRepository from 'App/Repositories/Message/MessageRepository'

/**
 * User container
 */
container.registerSingleton<IUser.Repository>(
  'UsersRepository',
  delay(() => UsersRepository),
)

container.registerSingleton<IConversation.Repository>(
  'ConversationsRepository',
  delay(() => ConversationsRepository),
)

container.registerSingleton<IMessage.Repository>(
  'MessageRepository',
  delay(() => MessageRepository),
)
