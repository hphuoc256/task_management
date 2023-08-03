import Route from '@ioc:Adonis/Core/Route'


export const bookingRoutes = () => {
  Route.group(() => {
    Route.get('/statistical', 'BookingsController.statistical')
    Route.get('/', 'BookingsController.index')
    Route.get('/:id', 'BookingsController.detail')
    Route.post('/store', 'BookingsController.store')
    Route.post('/update/:id', 'BookingsController.update')

  }).prefix('booking').middleware('auth')
}
