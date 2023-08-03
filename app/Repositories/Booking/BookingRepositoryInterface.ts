import BaseInterface from 'App/Repositories/BaseInterface'
import Booking from 'App/Models/Booking'
import { DateTime } from 'luxon'

export namespace IBooking {
  export interface Repository extends BaseInterface<typeof Booking> {
    bookingsInMonth({ year, month }: DTO.StatisticalParams): Promise<any>
  }

  export namespace DTO {
    export type List = {
      page: number
      perPage: number
      search: string
    }

    export type Store = {
      name: string
      phone: string
      department?: string
      repeat?: string
      startAt?: DateTime
      endAt?: DateTime
      userId: number
      roomId: number
    }

    export type Update = {
      name: string
      phone: string
      department?: string
      status?: string
      repeat?: string
      startAt?: DateTime
      endAt?: DateTime
      roomId?: number
    }

    export type StatisticalParams = {
      year?: number
      month?: number
    }
  }
}

