import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string.nullableAndOptional(),
    type: schema.string({}, [
      rules.required(),
    ]),
    participants: schema.array([
      rules.required(),
    ]).members(schema.number([
      rules.required(),
    ])),
  })

  public messages: CustomMessages = {}
}
