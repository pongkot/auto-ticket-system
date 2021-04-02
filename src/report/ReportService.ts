import { IReportService } from './interfaces/IReportService';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from '../constants';
import { Observable } from 'rxjs';
import { IParkingLotStageRepository } from '../parking-lot-stage/interfaces/IParkingLotStageRepository';
import { filter, map, toArray } from 'rxjs/operators';
import { ParkingLotStageModel } from '../parking-lot-stage/ParkingLotStageModel';
import * as _ from 'lodash';

@Injectable()
export class ReportService implements IReportService {
  private readonly logger: Logger = new Logger('ReportService');

  constructor(
    @Inject(Repository.PARKING_LOT_STAGE)
    private readonly parkingLotStageRepository: IParkingLotStageRepository,
  ) {}

  // TODO refactor
  getLicencePlateByCarSize(size: 's' | 'm' | 'l'): Observable<Array<string>> {
    return this.parkingLotStageRepository.listParkingLotStage().pipe(
      filter((Slot: ParkingLotStageModel) => _.eq(Slot.getAvailable(), false)),
      toArray(),
      map((list) => _.groupBy(list, 'carSize')[size]),
      map((list) => {
        if (list) {
          return list.map((doc) => doc.getLicencePlate());
        } else {
          return [];
        }
      }),
      map((list) => _.uniq(list)),
    );
  }
}
