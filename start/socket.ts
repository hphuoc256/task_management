import Ws from 'App/Services/Ws'
import { authenticate } from 'App/Utils'

Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', async (socket) => {
  authenticate(socket).then(async (user) => {

    socket.emit('loginSuccess', { success: true })

    socket.on('joinRoom', (room: string) => {
      socket.join(room)
      socket.to(room).emit('user:joined', { message: `${user.username} joined the room`, user: user.email })
    })

    socket.on('typing', (room) => {
      socket.to(room).emit('user:typing', { message: `${user.username} is typing`, user: user.email })
    })

    socket.on('stopTyping', (room) => {
      socket.to(room).emit('user:stopTyping', { message: `${user.username} stop typing`, user: user.email })
    })

    socket.on('leaveRoom', (room: string) => {
      socket.leave(room)
      socket.to(room).emit('user:left', { message: `${user.username} left the room`, user: user.email })
    })

  }).catch(() => {
    socket.emit('loginError', { success: false })
  })
})
