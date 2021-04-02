import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { Service } from '../constants';
import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';
import { CreateParkingLotDto } from './dto/CreateParkingLotDto';
import { map } from 'rxjs/operators';

interface IA {
  capacity: number;
  parking: {
    small: number;
    medium: number;
    large: number;
    total: number;
  };
  available: {
    small: number;
    medium: number;
    large: number;
  };
}

interface IB extends IA {
  subject: string;
}

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
  getParkingLotStatus(): Observable<IB> {
    return this.parkingLotStageService.getSummaryParkingLotStage().pipe(
      map((result: IA) => ({
        subject: 'Parking lot status',
        ...result,
      })),
    );
  }
}
