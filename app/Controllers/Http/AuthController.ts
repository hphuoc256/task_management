import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import { inject } from '@adonisjs/fold'
import LoginValidator from 'App/Validators/Auth/LoginValidator'

@inject()
export default class AuthController {

  constructor(
    protected userService: UserService,
  ) {
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)

    try {
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

      return response.status(200).json(result)
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.status(200).json({
      status: true,
      message: 'success',
      data: {},
    })
  }

}
