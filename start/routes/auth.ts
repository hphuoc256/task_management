import Route from '@ioc:Adonis/Core/Route'

export const authRoutes = () => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/logout', 'AuthController.logout').middleware('auth')
  }).prefix('auth')
}
