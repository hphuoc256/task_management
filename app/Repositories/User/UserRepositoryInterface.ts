import BaseInterface from 'App/Repositories/BaseInterface'
import User from 'App/Models/User'

export namespace IUser {
  export interface Repository extends BaseInterface<typeof User> {
    updatePoint(params: DTO.UpdatePoint): Promise<User | null>
  }

  export namespace DTO {
    export type List = {
      page: number
      perPage: number
      search: string
    }

    export type UpdatePoint = {
      userId: number
      rotationId: number,
      point: number
    }
  }
}

