import Booking from 'App/Models/Booking'
import { IBooking } from 'App/Repositories/Booking/BookingRepositoryInterface'
import BaseRepository from 'App/Repositories/BaseRepositoryInterface'
import { DateTime } from 'luxon'

export default class BookingRepository
  extends BaseRepository<typeof Booking>
  implements IBooking.Repository {
  constructor() {
    super(Booking)
  }

  public async bookingsInMonth({ year = DateTime.local().year, month = DateTime.local().month }) {
    const firstDayOfMonth = DateTime.fromObject({ year, month, day: 1 })
    const lastDayOfMonth = firstDayOfMonth.endOf('month')

    const daysInMonth = []
    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day = day.plus({ days: 1 })) {
      // @ts-ignore
      daysInMonth.push(day)
    }

    return await Promise.all(daysInMonth.map(async (day: any) => {
      const bookings = await Booking.query()
        .whereRaw('DATE(start_at) = ?', [day.toFormat('yyyy-MM-dd')])

      return {
        date: day.toFormat('yyyy-MM-dd'),
        bookings: bookings,
      }
    }))
  }
}
