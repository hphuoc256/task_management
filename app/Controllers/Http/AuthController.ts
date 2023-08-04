import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import { inject } from '@adonisjs/fold'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import { ApiResponse } from 'App/Utils/ApiResponse'

@inject()
export default class AuthController {

  constructor(
    protected userService: UserService,
  ) {
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(LoginValidator)

      const user = await this.userService.getByEmail(email)

      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7 days',
      })

      const result = {
        status: true,
        message: 'success',
        data: {
          token: token.toJSON(),
          user,
        },
      }

      return ApiResponse.success(response, result)

    } catch (error) {
      return ApiResponse.error(response, error?.messages?.errors || [], 422)
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return ApiResponse.success(response, [])
  }

}
