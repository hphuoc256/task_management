import BaseInterface from 'App/Repositories/BaseInterface'
import Rotation from 'App/Models/Rotation'

export namespace IRotation {
  export interface Repository extends BaseInterface<typeof Rotation> {
    getList(): Promise<Rotation[]>
  }

  export namespace DTO {
    export type Create = {
      userId: number
      rotationId: number
    }
  }
}
