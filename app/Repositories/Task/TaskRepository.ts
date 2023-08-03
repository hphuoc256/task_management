import BaseRepository from 'App/Repositories/BaseRepositoryInterface'
import Task from 'App/Models/Task'
import { ITask } from 'App/Repositories/Task/TaskRepositoryInterface'

export default class TaskRepository
  extends BaseRepository<typeof Task>
  implements ITask.Repository {
  constructor() {
    super(Task)
  }

  public async getById(id: number): Promise<Task | null> {
    return this.orm.query().where('id', id)
      .preload('userCreate')
      .preload('userAssign')
      .first()
  }
}
