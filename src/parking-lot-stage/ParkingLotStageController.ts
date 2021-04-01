import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { CONFIG, Service } from '../constants';
import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Observable, of } from 'rxjs';
import { ObjectId } from 'mongodb';
import { CreateParkingLotDto } from './dto/CreateParkingLotDto';
import { IConfig } from '../common/interfaces';

@Controller('parking-lot-stage')
export class ParkingLotStageController {
  private readonly logger: Logger = new Logger('ParkingLotStageController');

  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStage: IParkingLotStageService,
    @Inject(CONFIG)
    private readonly config: IConfig,
  ) {}

  @Post()
  createParkingLot(
    @Body() body: CreateParkingLotDto,
  ): Observable<{ parkingLotId: Array<ObjectId> }> {
    return this.parkingLotStage.createParkingLot(body.size);
  }

  @Get('status')
  getParkingLotStatus(): Observable<{
    subject: string;
    capacity: number;
    parking: number;
    available: {
      s: number;
      m: number;
      l: number;
    };
  }> {
    return of({
      subject: 'Parking lot status',
      capacity: 0,
      parking: 0,
      available: {
        s: 0,
        m: 0,
        l: 0,
      },
    });
  }
}
