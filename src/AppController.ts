import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AppService } from './AppService';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('slot/available')
  getAvailableStatus(@Query('size') size: 's' | 'm' | 'l' | 'all') {
    if (!size) {
      size = 'all';
    }

    if (!['s', 'm', 'l', 'all'].find((i: string) => _.eq(i, size))) {
      throw new HttpException(
        'size must be one of the following values: s, m, l, all',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.appService.getAvailableParkingLotByCarSize(size).pipe(
      map((result) => {
        return {
          subject: `Available parking lot for car size ${_.toUpper(size)}`,
          slot: result,
        };
      }),
    );
  }
}
