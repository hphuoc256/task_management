import { inject } from '@adonisjs/fold'
import BookingRepository from 'App/Repositories/Booking/BookingRepository'
import { IBooking } from 'App/Repositories/Booking/BookingRepositoryInterface'
import Booking from 'App/Models/Booking'

@inject()
export default class BookingService {
  constructor(
    protected repo: BookingRepository,
  ) {
  }

  public async list({ page = 1, perPage = 10, search = '' }: IBooking.DTO.List) {
    return await this.repo.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => scopes.searchQueryScope(search),
    })
  }

  public async getOne(id: number): Promise<Booking | null> {
    return await this.repo.findBy('id', id)
  }

  public async store(params: IBooking.DTO.Store): Promise<Booking> {
    if (params.startAt) {
      params.startAt = params.startAt.toFormat('yyyy-MM-dd HH:mm:ss') as any
    }
    if (params.endAt) {
      params.endAt = params.endAt.toFormat('yyyy-MM-dd HH:mm:ss') as any
    }
    return await this.repo.store(params)
  }

  public async update(id: number, params: IBooking.DTO.Update): Promise<number> {
    const booking = await this.getOne(id)
    if (!booking) return 50

    if (params.startAt) {
      params.startAt = params.startAt.toFormat('yyyy-MM-dd HH:mm:ss') as any
    }
    if (params.endAt) {
      params.endAt = params.endAt.toFormat('yyyy-MM-dd HH:mm:ss') as any
    }

    booking.merge({
      ...params,
    })

    await this.repo.save(booking)
    return 0
  }

  public async bookingsInMonth({month, year}) {
    return await this.repo.bookingsInMonth({month, year})
  }
}
