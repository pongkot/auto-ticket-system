import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './AppService';
import { Service } from './constants';
import { IParkingLotStageService } from './parking-lot-stage/interfaces/IParkingLotStageService';
import * as _ from 'lodash';

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

  @Get('available')
  getAvailableStatus(@Query('size') size: 's' | 'm' | 'l' | 'all') {
    if (!size) {
      size = 'all';
    }

    if (['s', 'm', 'l', 'all'].find((i: string) => _.eq(i, size))) {
      //
    }
  }
}
