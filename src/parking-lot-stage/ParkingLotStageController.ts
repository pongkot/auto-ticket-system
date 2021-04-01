import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Service } from '../constants';
import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';

@Controller('parking-lot-stage')
export class ParkingLotStageController {
  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStage: IParkingLotStageService,
  ) {}

  @Post()
  createParkingLot(
    @Body('size') size: 3 | 4,
  ): Observable<{ parkingLotId: Array<ObjectId> }> {
    return this.parkingLotStage.createParkingLot(size);
  }
}
