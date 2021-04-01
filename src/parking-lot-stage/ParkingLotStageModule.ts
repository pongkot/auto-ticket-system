import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ParkingLotStageMapping } from './ParkingLotStageMapping';
import { ParkingLotStageRepository } from './ParkingLotStageRepository';
import { Mapping, Repository } from '../constants';

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
  ],
  exports: [Repository.PARKING_LOT_STAGE],
})
export class ParkingLotStageModule {}
