import BaseRepository from 'App/Repositories/BaseRepositoryInterface'
import Rotation from 'App/Models/Rotation'
import { IRotation } from 'App/Repositories/Rotation/RotationRepositoryInterface'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RotationInterface
  extends BaseRepository<typeof Rotation>
  implements IRotation.Repository {
  constructor() {
    super(Rotation)
  }

  public async getList(): Promise<Rotation[]> {
    return Database
      .from('rotations')
  }

}
