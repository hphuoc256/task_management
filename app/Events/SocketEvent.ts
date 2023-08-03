import Ws from 'App/Services/Ws'


export default class SocketEvent {
  constructor() {
    Ws.boot()
  }

  // Join the socket to the specified room
  public sendChat(room: string, data: any) {
    const io = Ws.io;
    const socket = io.to(room);
    socket.to(room).emit('user:sendMessage',data)
  }
}
