import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingRepeat } from 'App/Enums/Booking'
import { DateTime } from 'luxon'

export default class StoreValidator {
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
    repeat: schema.enum.nullableAndOptional(Object.values(BookingRepeat)),
    startAt: schema.date.nullableAndOptional({
      format: 'yyyy-MM-dd HH:mm:ss',
    },[
      rules.afterOrEqual('today'),
    ]),
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

  public messages: CustomMessages = {}
}
