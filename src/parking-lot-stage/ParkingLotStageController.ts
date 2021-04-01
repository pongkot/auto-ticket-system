import { Controller, Inject, Post } from '@nestjs/common';
import { Service } from '../constants';
import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Observable } from 'rxjs';

@Controller('parking-lot-stage')
export class ParkingLotStageController {
  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStage: IParkingLotStageService,
  ) {}

  @Post()
  createParkingLot(): Observable<any> {
    return this.parkingLotStage.createParkingLot(3);
  }
}
