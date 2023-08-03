import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookingService from 'App/Services/BookingService'
import { inject } from '@adonisjs/fold'

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

    return response.status(200).json({
      status: true,
      message: 'success',
      data: bookings,
    })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    return response.status(200).json({
      status: true,
      message: 'success',
      data: [],
    })
  }
}
