import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { Service } from '../constants';
import { IReportService } from './interfaces/IReportService';
import { map } from 'rxjs/operators';

@Controller('report')
export class ReportController {
  private readonly logger: Logger = new Logger('ReportController');

  constructor(
    @Inject(Service.REPORT)
    private readonly reportService: IReportService,
  ) {}

  @Get('licence-plate')
  listLicencePlateBySize(
    @Query('size') size: 's' | 'm' | 'l',
  ): Observable<{
    subject: string;
    licencePlateList: Array<string>;
  }> {
    if (['s', 'm', 'l'].find((doc: string) => _.eq(doc, size))) {
      return this.reportService.getLicencePlateByCarSize(size).pipe(
        map((result) => ({
          subject: `Licence plate by car size ${_.toUpper(size)}`,
          licencePlateList: result,
        })),
      );
    } else {
      throw new HttpException(
        'size must be one of the following values: s, m, l',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
