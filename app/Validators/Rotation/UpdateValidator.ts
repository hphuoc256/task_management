import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(100),
    ]),
    value: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(10),
    ]),
    rate: schema.number([
      rules.range(0, 100),
    ]),
    color: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(10),
    ]),
  })

  public messages: CustomMessages = {}
}
