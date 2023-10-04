import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from 'src/notification/dtos/create-notification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Venue } from './entities/venue.entity';
import { VenueStatusEnum } from './enums/venue.enum';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    ...(process.env.NODE_ENV !== 'development' && { origin: '*', credentials: true, allowedHeaders: 'authorization' }),
  },
})
export class VenueGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  @SubscribeMessage('update_venue_status')
  async handleUpdateVenueStatus(@ConnectedSocket() socket: Socket, @MessageBody() data: Venue) {
    const message = {
      [VenueStatusEnum.Active]:
        'Sân bóng của bạn đã được xác nhận, bạn có thể quản lý sân bóng của mình trên hệ thống.',
      [VenueStatusEnum.Cancel]:
        'Yêu cầu sân bóng của bạn đã bị hủy, vui lòng liên hệ quản trị viên để biết thêm thông tin.',
    };
    const createNotiPayload: CreateNotificationDto = {
      title: 'Thông báo từ quản trị viên',
      message: message[data.status],
      user: data.user.id,
    };

    await this.notificationService.create(createNotiPayload);

    socket.to(String(data.user.id)).emit('update_venue_status', message[data.status]);
  }
}
