import BaseInterface from 'App/Repositories/BaseInterface'
import Room from 'App/Models/Room'

export namespace IRoom {
  export interface Repository extends BaseInterface<typeof Room> {
  }

  export namespace DTO {
    export type List = {
      page: number
      perPage: number
      search: string
    }

    export type Create = {
      name: string
      code: string
      description?: string
      status?: string
    }

    export type Update = {
      name?: string
      code?: string
      description?: string
      status?: string
    }
  }
}
