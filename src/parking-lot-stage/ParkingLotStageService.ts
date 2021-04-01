import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CONFIG, Mapping, Repository } from '../constants';
import { IConfig } from '../common/interfaces';
import { IParkingLotStageRepository } from './interfaces/IParkingLotStageRepository';
import { ParkingLotStageMapping } from './ParkingLotStageMapping';

@Injectable()
export class ParkingLotStageService implements IParkingLotStageService {
  private readonly logger: Logger = new Logger('ParkingLotStageService');

  constructor(
    @Inject(CONFIG)
    private readonly config: IConfig,
    @Inject(Repository.PARKING_LOT_STAGE)
    private readonly parkingLotStageRepository: IParkingLotStageRepository,
    @Inject(Mapping.PARKING_LOT_STAGE)
    private readonly parkingLotStageMapping: ParkingLotStageMapping,
  ) {}

  createParkingLot(size: 3 | 4): Observable<{ parkingLotId: Array<string> }> {
    return undefined;
  }
}
