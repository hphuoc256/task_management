import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ConversationType } from 'App/Enums/Conversation'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string.nullableAndOptional(),
    type: schema.enum(Object.values(ConversationType)),
    participants: schema.array([
      rules.required(),
    ]).members(schema.number([
      rules.required(),
    ])),
  })

  public messages: CustomMessages = {}
}
