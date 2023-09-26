import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(255),
    ]),
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.required(),
      rules.minLength(6),
      rules.maxLength(100),
      rules.confirmed('passwordConfirmation')
    ]),
  })

  public messages: CustomMessages = {}
}
