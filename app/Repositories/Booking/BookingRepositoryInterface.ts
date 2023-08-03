import BaseInterface from 'App/Repositories/BaseInterface'
import Booking from 'App/Models/Booking'

export namespace IBooking {
  export interface Repository extends BaseInterface<typeof Booking> {
  }

  export namespace DTO {
    export type List = {
      page: number
      perPage: number
      search: string
    }

  }
}

