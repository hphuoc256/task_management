import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import RotationService from 'App/Services/RotationService'
import { ApiResponse } from 'App/Utils/ApiResponse'
import { toNumber } from 'lodash'
import StoreValidator from 'App/Validators/Rotation/StoreValidator'
import UpdateValidator from 'App/Validators/Rotation/UpdateValidator'
import Rotation from 'App/Models/Rotation'
import UserService from 'App/Services/UserService'

@inject()
export default class RotationsController {
  constructor(
    protected rotationService: RotationService,
    protected userService: UserService,
  ) {
  }

  public async list({ response, request }: HttpContextContract): Promise<void> {
    const id = request.params()?.id
    let rotations: any
    if (id) {
      rotations = await this.rotationService.findById(id)
    } else {
      rotations = await this.rotationService.list()
    }
    return ApiResponse.success(response, rotations)
  }

  public async store({ response, request }: HttpContextContract): Promise<void> {
    try {
      const payload = await request.validate(StoreValidator)

      const result = await this.rotationService.store(payload)

      return ApiResponse.success(response, result)
    } catch (e) {
      return ApiResponse.error(response, e?.messages?.errors || [], 422)
    }
  }

  public async make({ auth, response }: HttpContextContract): Promise<void> {
    try {
      const userId = toNumber(auth.user?.id)

      const result = await this.rotationService.make(userId)

      return ApiResponse.success(response, result)
    } catch (e) {
      return ApiResponse.error(response, e?.messages?.errors || [], 422)
    }
  }

  public async update({ response, request }: HttpContextContract): Promise<void> {
    try {
      const payload = await request.validate(UpdateValidator)
      const { id } = request.params()

      const rotation = await this.rotationService.update(id, payload)

      if (rotation instanceof Rotation) {
        return ApiResponse.success(response, rotation)
      }
      return ApiResponse.error(response, [], rotation)
    } catch (e) {
      return ApiResponse.error(response, e?.messages?.errors || [], 422)
    }
  }

  public async delete({ response, request }: HttpContextContract): Promise<void> {
    try {
      const id = request.params().id

      const isDelete = await this.rotationService.delete(id)

      if (!isDelete)
        return ApiResponse.error(response, [], 70)
      return ApiResponse.success(response, [])
    } catch (e) {
      return ApiResponse.error(response, e?.messages?.errors || [], 74)
    }
  }

  public async history({ auth, response, request }: HttpContextContract): Promise<void> {
    try {
      const userId = auth.user?.id
      const histories = await this.userService.getHistoryById(userId, request)
      return ApiResponse.success(response, histories)
    } catch (e) {
      console.log(e)
      return ApiResponse.error(response, e?.messages?.errors || [])
    }
  }
}
