import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { ParkingLotStageModule } from './parking-lot-stage/ParkingLotStageModule';

@Module({
  imports: [ParkingLotStageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
