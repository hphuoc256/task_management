import { inject } from '@adonisjs/fold'
import BookingRepository from 'App/Repositories/Booking/BookingRepository'
import { IBooking } from 'App/Repositories/Booking/BookingRepositoryInterface'

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
}
