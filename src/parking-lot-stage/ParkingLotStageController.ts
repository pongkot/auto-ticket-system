import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Service } from '../constants';
import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';
import { CreateParkingLotDto } from './dto/CreateParkingLotDto';

@Controller('parking-lot-stage')
export class ParkingLotStageController {
  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStage: IParkingLotStageService,
  ) {}

  @Post()
  createParkingLot(
    @Body() body: CreateParkingLotDto,
  ): Observable<{ parkingLotId: Array<ObjectId> }> {
    return this.parkingLotStage.createParkingLot(body.size);
  }
}
