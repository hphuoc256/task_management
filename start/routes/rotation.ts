import Route from '@ioc:Adonis/Core/Route'

export const rotationRoutes = () => {

  Route.group(() => {

    Route.get('/history', 'RotationsController.history')
    Route.get('/:id?', 'RotationsController.list')
    Route.post('/store', 'RotationsController.store')
    Route.post('/update/:id', 'RotationsController.update')
    Route.post('/make', 'RotationsController.make')
    Route.post('/delete/:id', 'RotationsController.delete')

  }).prefix('rotation').middleware('api')

}
