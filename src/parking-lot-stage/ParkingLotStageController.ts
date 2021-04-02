import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { Service } from '../constants';
import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';
import { CreateParkingLotDto } from './dto/CreateParkingLotDto';
import { map } from 'rxjs/operators';

@Controller('parking-lot-stage')
export class ParkingLotStageController {
  private readonly logger: Logger = new Logger('ParkingLotStageController');

  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStageService: IParkingLotStageService,
  ) {}

  @Post()
  createParkingLot(
    @Body() body: CreateParkingLotDto,
  ): Observable<{ parkingLotId: Array<ObjectId> }> {
    return this.parkingLotStageService.createParkingLot(body.size);
  }

  @Get('status')
  getParkingLotStatus(): Observable<{
    subject: string;
    capacity: number;
    parking: {
      s: number;
      m: number;
      l: number;
      total: number;
    };
    available: {
      s: number;
      m: number;
      l: number;
    };
  }> {
    return this.parkingLotStageService.getSummaryParkingLotStage().pipe(
      map((result) => ({
        subject: 'Parking lot status',
        ...result,
      })),
    );
  }
}
