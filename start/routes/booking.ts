import Route from '@ioc:Adonis/Core/Route'


export const bookingRoutes = () => {

  Route.group(() => {
    Route.group(() => {
      Route.get('/statistical', 'BookingsController.statistical')
      Route.get('/', 'BookingsController.index')
      Route.get('/:id', 'BookingsController.detail')
      Route.post('/store', 'BookingsController.store')
      Route.post('/update/:id', 'BookingsController.update')
    }).prefix('booking')

    Route.group(() => {
      Route.get('/', 'RoomsController.index')
      Route.get('/:id', 'RoomsController.detail')
      Route.post('/update/:id', 'RoomsController.update')
      Route.post('/store', 'RoomsController.store')
    }).prefix('room')

  }).middleware('api')

}
