import Route from '@ioc:Adonis/Core/Route'

export const chatRoutes = () => {

  Route.group(() => {
    Route.get('/', 'ConversationsController.index')
    Route.get('/:id', 'ConversationsController.detail')
    Route.post('/store', 'ConversationsController.store')

  }).prefix('conversation').middleware('auth')

  Route.group(() => {
    Route.get('/', 'MessagesController.index')
    Route.post('/send', 'MessagesController.store')

  }).prefix('message').middleware('auth')

}
