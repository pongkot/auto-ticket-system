import { Module } from '@nestjs/common';
import { ParkingLotStageModule } from '../parking-lot-stage/ParkingLotStageModule';
import { TicketController } from './TicketController';
import { Service } from '../constants';
import { TicketService } from './TicketService';

@Module({
  imports: [ParkingLotStageModule],
  providers: [
    {
      provide: Service.TICKET,
      useClass: TicketService,
    },
  ],
  controllers: [TicketController],
})
export class TicketModule {}
