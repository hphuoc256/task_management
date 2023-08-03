import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingRepeat, BookingStatus } from 'App/Enums/Booking'
import { isEndAtGreaterThanStartAtWithMargin } from 'App/Utils'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string({}, [
      rules.required(),
      rules.maxLength(255),
    ]),
    phone: schema.number([
      rules.required(),
      rules.minLength(10),
      rules.maxLength(11),
    ]),
    department: schema.string.nullable({}, [
      rules.maxLength(100),
    ]),
    status: schema.enum.nullable(Object.values(BookingStatus)),
    repeat: schema.enum.nullable(Object.values(BookingRepeat)),
    startAt: schema.date.nullable({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
    endAt: schema.date.nullable({
      format: 'yyyy-MM-dd HH:mm:ss',
    }, [
    ]),
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
