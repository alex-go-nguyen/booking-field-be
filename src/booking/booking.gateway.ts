import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as moment from 'moment';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CreateNotificationDto } from 'src/notification/dtos/create-notification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@WebSocketGateway({
  path: '/events',
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowHeader: {
      'Access-Control-Allow-Headers': 'Content-Type, authorization, x-token',
    },
  },
})
export class BookingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService,
  ) {}

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }

  @SubscribeMessage('booking')
  async handleBooking(@ConnectedSocket() socket: Socket, @MessageBody() data: Booking) {
    const booking = await this.bookingService.findOne({
      where: {
        id: data.id,
      },
      relations: {
        pitch: {
          venue: {
            user: true,
          },
        },
        user: true,
      },
    });

    const owner = booking.pitch.venue.user;

    const message = `${booking.user.username} đã đặt sân ${booking.pitch.name} của bạn từ ${moment(
      booking.startTime,
    ).format('LT')} - ${moment(booking.endTime).format('LT')} ngày ${moment(booking.startTime).format('DD/MM/YYYY')}`;

    const createNotiPayload: CreateNotificationDto = {
      title: 'Thông báo đặt sân',
      message,
      user: booking.pitch.venue.user.id,
    };

    await this.notificationService.create(createNotiPayload);

    socket.to(String(owner.id)).emit('booking', message);
  }

  async handleConnection(socket: Socket) {
    const authHeader = socket.handshake.headers;

    const [type, token] = authHeader.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      try {
        const user = await this.authService.handleVerifyToken(token);

        console.log('user connect: ', user.username);

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
