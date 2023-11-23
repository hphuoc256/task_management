import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TaskStatus } from 'App/Enums/Task'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string({}, [
      rules.required(),
      rules.maxLength(255),
    ]),
    description: schema.string.optional(),
    dueDate: schema.date.optional(),
    status: schema.enum.optional(Object.values(TaskStatus)),
    assignId: schema.number.optional(),
  })

  public messages: CustomMessages = {}
}
