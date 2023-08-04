import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import RoomService from 'App/Services/RoomService'
import StoreValidator from 'App/Validators/Room/StoreValidator'
import { ApiResponse } from 'App/Utils/ApiResponse'
import { IRoom } from 'App/Repositories/Room/RoomRepositoryInterface'
import { toNumber } from 'lodash'
import UpdateValidator from 'App/Validators/Room/UpdateValidator'

@inject()
export default class RoomsController {
  constructor(
    protected roomService: RoomService,
  ) {
  }

  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('limit', 10)
      const search = request.input('search', '')

      const rooms = await this.roomService.list({ page, perPage, search })

      return ApiResponse.success(response, rooms)
    } catch (e) {
      ApiResponse.error(response, [])
    }
  }

  public async detail({ request, response }: HttpContextContract) {
    try {
      const room = await this.roomService.getOne(toNumber(request.params().id))

      if (!room) ApiResponse.error(response, [], 50)
      return ApiResponse.success(response, room)
    } catch (e) {
      ApiResponse.error(response, [])
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(UpdateValidator)

      const params = {
        ...payload,
      } as IRoom.DTO.Update

      const rooms = await this.roomService.update(toNumber(request.params()?.id), params)

      if (rooms === 0) return ApiResponse.success(response, rooms)
      return ApiResponse.error(response, [], rooms)
    } catch (error) {
      console.log(error?.message)
      ApiResponse.error(response, error?.message?.errors, 422)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(StoreValidator)

      const params = {
        ...payload,
      } as IRoom.DTO.Create

      const room = await this.roomService.store(params)

      return ApiResponse.success(response, room)
    } catch (e) {
      return ApiResponse.error(response, e?.messages?.errors || [], 422)
    }
  }
}
