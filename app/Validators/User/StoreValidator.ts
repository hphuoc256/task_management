import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    username: schema.string({ escape: true, trim: true }, [rules.minLength(3), rules.maxLength(80)]),
  })

  public messages: CustomMessages = {}
}
