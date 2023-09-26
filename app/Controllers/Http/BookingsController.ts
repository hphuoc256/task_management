import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingService from 'App/Services/BookingService'
import { inject } from '@adonisjs/fold'
import StoreValidator from 'App/Validators/Booking/StoreValidator'
import UpdateValidator from 'App/Validators/Booking/UpdateValidator'
import { ApiResponse } from 'App/Utils/ApiResponse'
import { IBooking } from 'App/Repositories/Booking/BookingRepositoryInterface'
import { toNumber } from 'lodash'

@inject()
export default class BookingsController {
  constructor(
    protected bookingService: BookingService,
  ) {
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('limit', 10)
    const search = request.input('search', '')

    const bookings = await this.bookingService.list({ page, perPage, search })

    return ApiResponse.success(response, bookings)
  }

  public async detail({ request, response }: HttpContextContract) {
    try {
      const booking = await this.bookingService.getOne(toNumber(request.params().id))

      if (!booking) return ApiResponse.error(response, [], 50)
      return ApiResponse.success(response, booking)
    } catch (e) {
      return ApiResponse.error(response, [], 52)
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(StoreValidator)

      const params = {
        ...payload,
        userId: auth.user?.id,
      } as IBooking.DTO.Store

      const booking = await this.bookingService.store(params)

      if (!booking) return ApiResponse.error(response, [], 52)
      return ApiResponse.success(response, booking)
    } catch (error) {
      console.log(error)
      return ApiResponse.error(response, error?.messages?.errors || [], 422)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(UpdateValidator)

      const params = {
        ...payload,
      } as IBooking.DTO.Update

      const booking = await this.bookingService.update(toNumber(request.params()?.id), params)

      if (booking === 0) return ApiResponse.success(response, booking)
      return ApiResponse.error(response, [], booking)
    } catch (error) {
      return ApiResponse.error(response, error?.messages?.errors || [], 422)
    }
  }

  public async statistical({ request, response }: HttpContextContract) {
    try {
      const { year, month } = request.all()

      const bookings = await this.bookingService.bookingsInMonth({ month, year })

      return ApiResponse.success(response, bookings)
    } catch (e) {
      return ApiResponse.error(response, [])
    }
  }
}
