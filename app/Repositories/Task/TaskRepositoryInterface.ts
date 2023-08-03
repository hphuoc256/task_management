import BaseInterface from 'App/Repositories/BaseInterface'
import Task from 'App/Models/Task'
import { DateTime } from 'luxon'

export namespace ITask {
  export interface Repository extends BaseInterface<typeof Task> {
    getById(id: number): Promise<Task | null>
  }

  export namespace DTO {
    export type List = {
      page: number
      perPage: number
      search?: string
    }

    export type Create = {
      title: string
      description?: string
      dueDate?: DateTime
      assignId?: number
      userId: number
      status?: string
    }

    export type Update = {
      title?: string
      description?: string
      dueDate?: DateTime
      assignId?: number
      status?: string
    }
  }
}
