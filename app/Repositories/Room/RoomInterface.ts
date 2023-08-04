import BaseRepository from 'App/Repositories/BaseRepositoryInterface'
import Room from 'App/Models/Room'
import { IRoom } from 'App/Repositories/Room/RoomRepositoryInterface'

export default class RoomInterface
  extends BaseRepository<typeof Room>
  implements IRoom.Repository {
  constructor() {
    super(Room)
  }

}
