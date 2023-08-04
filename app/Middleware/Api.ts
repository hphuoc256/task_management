import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorCode } from 'App/Utils/ErrorCode'

export default class Api {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {

    if (await auth.use('api').check()) {
      await next()
    } else {
      return response.status(200).json(
        {
          status: false,
          message: ErrorCode[401],
          code: 401,
          errors: [],
        },
      )
    }
  }
}
