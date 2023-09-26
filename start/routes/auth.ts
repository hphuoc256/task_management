import Route from '@ioc:Adonis/Core/Route'

export const authRoutes = () => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
    Route.post('/logout', 'AuthController.logout').middleware('api')

    Route.get('/me', 'AuthController.me').middleware('api')
    Route.post('/update', 'AuthController.update').middleware('api')
  }).prefix('auth')
}
