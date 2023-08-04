import Route from '@ioc:Adonis/Core/Route'

export const userRoutes = () => {
  Route.group(() => {

    Route.get('/', 'UsersController.list')
    Route.get('/:id', 'UsersController.detail')

  }).prefix('user')
    .middleware('api')
}
