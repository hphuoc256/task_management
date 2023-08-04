import { inject } from '@adonisjs/fold'
import RoomInterface from 'App/Repositories/Room/RoomInterface'
import { IRoom } from 'App/Repositories/Room/RoomRepositoryInterface'

@inject()
export default class RoomService {
  constructor(
    protected repo: RoomInterface,
  ) {
  }

  public async list({ page, perPage, search }: IRoom.DTO.List) {
    return await this.repo.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => scopes.searchQueryScope(search),
    })
  }

  public async getOne(id: number) {
    return await this.repo.findBy('id', id)
  }

  public async update(id: number, params: IRoom.DTO.Update) {
    const room = await this.getOne(id)
    if (!room) return 60

    room.merge({
      ...params,
    })

    await this.repo.save(room)
    return 0
  }

  public async store(params: IRoom.DTO.Create) {
    return await this.repo.store(params)
  }
}
