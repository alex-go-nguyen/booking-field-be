import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { SocketService } from './socket/socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    ...(process.env.NODE_ENV === 'production' && {
      origin: [process.env.CLIENT_URL, process.env.ADMIN_CLIENT_URL],
      credentials: true,
      allowedHeaders: 'authorization',
    }),
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly authService: AuthService, private socketService: SocketService) {}

  afterInit() {
    this.socketService.socket = this.server;
    this.server.emit('testing', { do: 'stuff' });
  }

  async handleConnection(socket: Socket) {
    const authHeader = socket.handshake.headers;

    const [type, token] = authHeader.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      try {
        const user = await this.authService.handleVerifyToken(token);

        socket.join(String(user.id));
      } catch (e) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    const authHeader = socket.handshake.headers;

    const [type, token] = authHeader.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      const user = await this.authService.handleVerifyToken(token);

      socket.leave(String(user.id));
    }
  }
}
