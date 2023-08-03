import { inject } from '@adonisjs/fold'
import User from 'App/Models/User'
import { IUser } from 'App/Repositories/User/UserRepositoryInterface'
import UserRepository from 'App/Repositories/User/UserRepository'
import { PaginateContractType } from 'App/Repositories/BaseInterface'

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
}
