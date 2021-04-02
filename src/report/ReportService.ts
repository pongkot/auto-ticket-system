import { IReportService } from './interfaces/IReportService';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from '../constants';
import { Observable, of } from 'rxjs';
import { IParkingLotStageRepository } from '../parking-lot-stage/interfaces/IParkingLotStageRepository';

@Injectable()
export class ReportService implements IReportService {
  private readonly logger: Logger = new Logger('ReportService');

  constructor(
    @Inject(Repository.PARKING_LOT_STAGE)
    private readonly parkingLotStageRepository: IParkingLotStageRepository,
  ) {}

  getLicencePlateByCarSize(size: 's' | 'm' | 'l'): Observable<any> {
    return this.parkingLotStageRepository.listParkingLotStage();
  }
}
