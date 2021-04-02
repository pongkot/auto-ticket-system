import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './AppService';
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
}
