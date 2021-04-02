import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { ParkingLotStageModule } from './parking-lot-stage/ParkingLotStageModule';
import { TicketModule } from './ticket/TicketModule';
import { ReportModule } from './report/ReportModule';

@Module({
  imports: [ParkingLotStageModule, TicketModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
