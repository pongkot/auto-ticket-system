import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ParkingLotStageMapping } from './ParkingLotStageMapping';
import { ParkingLotStageRepository } from './ParkingLotStageRepository';
import { Mapping, Repository, Service } from '../constants';
import { ParkingLotStageService } from './ParkingLotStageService';
import { ParkingLotStageController } from './ParkingLotStageController';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: Mapping.PARKING_LOT_STAGE,
      useClass: ParkingLotStageMapping,
    },
    {
      provide: Repository.PARKING_LOT_STAGE,
      useClass: ParkingLotStageRepository,
    },
    {
      provide: Service.PARKING_LOT_STAGE,
      useClass: ParkingLotStageService,
    },
  ],
  controllers: [ParkingLotStageController],
  exports: [],
})
export class ParkingLotStageModule {}
