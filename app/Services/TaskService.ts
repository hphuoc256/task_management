import { inject } from '@adonisjs/fold'
import TaskRepository from 'App/Repositories/Task/TaskRepository'
import { ITask } from 'App/Repositories/Task/TaskRepositoryInterface'
import Task from 'App/Models/Task'
import UserRepository from 'App/Repositories/User/UserRepository'

@inject()
export default class TaskService {
  constructor(
    protected repo: TaskRepository,
    protected userRepository: UserRepository,
  ) {
  }

  public async list({ page = 1, perPage = 10, search = '' }: ITask.DTO.List) {
    return this.repo.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => scopes.searchQueryScope(search),
    })
  }

  public async detail(id: number): Promise<Task | null> {
    return this.repo.getById(id)
  }

  public async store(params: ITask.DTO.Create): Promise<Task> {
    if (params.dueDate) {
      params.dueDate = params.dueDate?.toFormat('yyyy-MM-dd HH:mm:ss') as any
    }
    return this.repo.store(params)
  }

  public async update(id: number, params: ITask.DTO.Update): Promise<Task | number> {
    const task = await this.repo.findBy('id', id)
    if (!task) return 30

    if (params.assignId) {
      const checkUserAssign = await this.userRepository.findBy('id', params.assignId)
      if (!checkUserAssign) return 32
    }

    task.merge({
      ...params,
      dueDate: params.dueDate?.toFormat('yyyy-MM-dd HH:mm:ss') as any,
    })

    await this.repo.save(task)
    return task
  }
}
