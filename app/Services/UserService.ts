import { inject } from '@adonisjs/fold'
import User from 'App/Models/User'
import { IUser } from 'App/Repositories/User/UserRepositoryInterface'
import UserRepository from 'App/Repositories/User/UserRepository'
import { PaginateContractType } from 'App/Repositories/BaseInterface'
import { toNumber } from 'lodash'

@inject()
export default class UserService {
  constructor(
    protected repo: UserRepository,
  ) {
  }

  public async list({ page = 1, perPage = 10, search = '' }: IUser.DTO.List): Promise<PaginateContractType<typeof User>> {
    return this.repo.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => scopes.searchQueryScope(search),
    })
  }

  public async getById(id: number): Promise<User | null> {
    return await this.repo.findBy('id', id)
  }

  public async getByEmail(email: string): Promise<User | null> {
    return await this.repo.findBy('email', email)
  }

  public async getHistoryById(id, request): Promise<any> {
    const limit = (request.input('limit') && toNumber(request.input('limit')) > 0) ? toNumber(request.input('limit')) : 10
    const page = (request.input('page') && toNumber(request.input('page')) > 0) ? toNumber(request.input('page')) : 1
    const offset = limit * (page - 1)
    const paginate = {
      limit,
      offset,
      page,
    }

    return await this.repo.historyRotationById(id, paginate)
  }

  public async update(id, data: any) {
    const user = await this.repo.findBy('id', id)
    if (user) {
      user.username = data.username
      await user.save()
    }
    return user?.toJSON()
  }

  public async create(data): Promise<User | null> {
    return this.repo.store(data)
  }
}
