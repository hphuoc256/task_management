import Route from '@ioc:Adonis/Core/Route'

export const rotationRoutes = () => {

  Route.group(() => {

    Route.get('/', 'RotationsController.list')
    Route.post('/store', 'RotationsController.store')

  }).prefix('rotation').middleware('api')

}
