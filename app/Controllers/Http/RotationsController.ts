import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import RotationService from 'App/Services/RotationService'
import { ApiResponse } from 'App/Utils/ApiResponse'
import { toNumber } from 'lodash'

@inject()
export default class RotationsController {
  constructor(
    protected rotationService: RotationService,
  ) {
  }

  public async list({ response }: HttpContextContract): Promise<void> {
    const rotations = await this.rotationService.list()
    return ApiResponse.success(response, rotations)
  }

  public async store({ auth, response }: HttpContextContract): Promise<void> {
    const userId = toNumber(auth.user?.id)
    const result = await this.rotationService.store(userId)
    return ApiResponse.success(response, result)
  }
}
