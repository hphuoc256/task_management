import Route from '@ioc:Adonis/Core/Route'

export const taskRoutes = () => {
  Route.group(() => {

    Route.get('/', 'TasksController.index')
    Route.get('/:id', 'TasksController.detail')
    Route.post('/store', 'TasksController.store')
    Route.post('/update/:id', 'TasksController.update')

  }).prefix('task').middleware('auth')
}
