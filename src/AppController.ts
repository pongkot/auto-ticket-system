import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { AppService } from './AppService';
import { Observable } from 'rxjs';
import { Service } from './constants';
import { IParkingLotStageService } from './parking-lot-stage/interfaces/IParkingLotStageService';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStageService: IParkingLotStageService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/search/licence-plate')
  searchLicencePlateByCarSize(@Query('size') size: string): Observable<any> {
    if (['s', 'm', 'l'].find((i) => size === i)) {
      return this.parkingLotStageService.getSummaryParkingLotStage().pipe();
    } else {
      throw new HttpException(
        'size must be one of the following values: s, m, l',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
