import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { BookingRepeat, BookingStatus } from 'App/Enums/Booking'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    allowedEndDate:
      this.ctx.request?.body()?.startAt ?
        DateTime
          .fromFormat(this.ctx.request?.body()?.startAt, 'yyyy-MM-dd HH:mm:ss')
          .plus({ minutes: 30 }) :
        null,
  })

  public schema = schema.create({
    roomId: schema.number([
      rules.required(),
      rules.exists({ table: 'rooms', column: 'id' }),
    ]),
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(255),
    ]),
    phone: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(10),
      rules.maxLength(12),
    ]),
    department: schema.string.nullableAndOptional({}, [
      rules.maxLength(100),
    ]),
    status: schema.enum.nullableAndOptional(Object.values(BookingStatus)),
    repeat: schema.enum.nullableAndOptional(Object.values(BookingRepeat)),
    startAt: schema.date.nullableAndOptional({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
    endAt: schema.date.nullableAndOptional(
      {
        format: 'yyyy-MM-dd HH:mm:ss',
      },
      [
        rules.requiredIfExists('startAt'),
        // @ts-ignore
        rules.afterOrEqual(this.refs?.allowedEndDate),
      ],
    ),
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
