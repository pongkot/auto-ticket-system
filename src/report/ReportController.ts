import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

@Controller('report')
export class ReportController {
  @Get('licence-plate')
  listLicencePlateBySize(
    @Query('size') size: 's' | 'm' | 'l',
  ): Observable<any> {
    if (['s', 'm', 'l'].find((doc: string) => _.eq(doc, size))) {
      return of(size);
    } else {
      throw new HttpException(
        'size must be one of the following values: s, m, l',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
