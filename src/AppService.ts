import { Inject, Injectable } from '@nestjs/common';
import { Service } from './constants';
import { IParkingLotStageService } from './parking-lot-stage/interfaces/IParkingLotStageService';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISummaryParkingLotStage } from './parking-lot-stage/interfaces/ISummaryParkingLotStage';
import * as _ from 'lodash';

@Injectable()
export class AppService {
  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStageService: IParkingLotStageService,
  ) {}

  getHello(): string {
    return 'OK';
  }

  getAvailableParkingLotByCarSize(
    size: 's' | 'm' | 'l' | 'all',
  ): Observable<any> {
    return this.parkingLotStageService.getSummaryParkingLotStage().pipe(
      map((result: ISummaryParkingLotStage) => {
        const { available } = result;

        if (_.eq(size, 'all')) {
          return available;
        } else {
          const sizeDoc = {
            s: 'small',
            m: 'medium',
            l: 'large',
          };
          const doc = {};
          doc[sizeDoc[size]] = available[sizeDoc[size]];
          return doc;
        }
      }),
    );
  }
}
