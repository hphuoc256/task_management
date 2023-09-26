import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import { inject } from '@adonisjs/fold'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import { ApiResponse } from 'App/Utils/ApiResponse'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'

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

  public async register({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(RegisterValidator)

      const user = this.userService.create(payload)

      return ApiResponse.success(response, user)

    } catch (error) {
      return ApiResponse.error(response, error?.messages?.errors || [], 422)
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return ApiResponse.success(response, [])
  }

  public async me({ response, auth }: HttpContextContract) {
    const user = auth.user
    return ApiResponse.success(response, user)
  }

  public async update({ response, auth, request }: HttpContextContract) {
    try {
      const id = auth.user?.id
      const user = await this.userService.update(id, request.all())
      return ApiResponse.success(response, user)
    } catch (error) {
      return ApiResponse.error(response, error?.messages?.errors || [], 422)
    }
  }

}
