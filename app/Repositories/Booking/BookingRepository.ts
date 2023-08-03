import Booking from 'App/Models/Booking'
import { IBooking } from 'App/Repositories/Booking/BookingRepositoryInterface'
import BaseRepository from 'App/Repositories/BaseRepositoryInterface'

export default class BookingRepository
  extends BaseRepository<typeof Booking>
  implements IBooking.Repository {
  constructor() {
    super(Booking)
  }


}
