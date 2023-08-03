import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    conversationId: schema.number([
      rules.required()
    ]),
    content: schema.string({}, [
      rules.required()
    ])
  })

  public messages: CustomMessages = {}
}
