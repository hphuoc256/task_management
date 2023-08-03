import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import UserService from 'App/Services/UserService'
import { ApiResponse } from 'App/Utils/ApiResponse'

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService,
  ) {
  }

  public async list({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('limit', 10)
    const search = request.input('search', '')

    const users = await this.userService.list({ page, perPage, search })
    return ApiResponse.success(response, users)
  }

  public async detail({ request, response }: HttpContextContract): Promise<void> {
    const { id } = request.params()
    const user = await this.userService.getById(id)

    if (!user) return ApiResponse.error(response, [], 10)
    return ApiResponse.success(response, user)
  }
}
