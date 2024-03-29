import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RoomStatus } from 'App/Enums/Room'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.maxLength(255),
    ]),
    code: schema.string.optional({ trim: true }, [
      rules.maxLength(100),
    ]),
    description: schema.string.nullableAndOptional({ trim: true }),
    status: schema.enum.nullableAndOptional(Object.values(RoomStatus)),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
