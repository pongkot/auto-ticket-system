import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { ParkingLotStageModule } from './parking-lot-stage/ParkingLotStageModule';
import { TicketModule } from './ticket/TicketModule';

@Module({
  imports: [ParkingLotStageModule, TicketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
