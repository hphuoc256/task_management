import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import TaskService from 'App/Services/TaskService'
import { ApiResponse } from 'App/Utils/ApiResponse'
import StoreValidator from 'App/Validators/Task/StoreValidator'
import { ITask } from 'App/Repositories/Task/TaskRepositoryInterface'
import UpdateValidator from 'App/Validators/Task/UpdateValidator'

@inject()
export default class TasksController {
  constructor(
    protected taskService: TaskService,
  ) {
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('limit', 10)
    const search = request.input('search', '')

    const tasks = await this.taskService.list({ page, perPage, search })

    return ApiResponse.success(response, tasks)
  }

  public async detail({ request, response }: HttpContextContract) {
    const task = await this.taskService.detail(request.params().id)
    if (!task) return ApiResponse.error(response, [], 30)
    return ApiResponse.success(response, task)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(StoreValidator)
    const userId = auth.user?.id

    const params = {
      userId,
      ...payload,
    } as ITask.DTO.Create

    const task = await this.taskService.store(params)

    if (!task) return ApiResponse.error(response, [])
    return ApiResponse.success(response, task)
  }

  public async update({ request, response }: HttpContextContract) {
    const payload = await request.validate(UpdateValidator)
    const id = request.params().id

    const task = await this.taskService.update(id, payload)

    if (typeof task === 'number') {
      return ApiResponse.error(response, [], task)
    }
    return ApiResponse.success(response, task)
  }
}
