import Route from '@ioc:Adonis/Core/Route'


export const bookingRoutes = () => {
  Route.group(() => {
    Route.get('/', 'BookingsController.index')
    Route.get('/:id', 'BookingsController.detail')
    Route.post('/store', 'BookingsController.store')

  }).prefix('booking').middleware('auth')
}
