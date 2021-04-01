import { Mongo } from '../common';
import { IParkingLotStageRepository } from './interfaces/IParkingLotStageRepository';
import { IParkingLotStageSchema } from '../../htdocs/database/auto-ticket-system';
import { Observable } from 'rxjs';
import { InsertWriteOpResult } from 'mongodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONFIG } from '../constants';
import { IConfig } from '../common/interfaces';

@Injectable()
export class ParkingLotStageRepository
  extends Mongo<IParkingLotStageSchema>
  implements IParkingLotStageRepository {
  private readonly logger: Logger = new Logger('ParkingLotStageRepository');

  constructor(
    @Inject(CONFIG)
    private readonly config: IConfig,
  ) {
    super();
    const { autoTicketSystem } = this.config.database;
    this.setDatabaseOption(autoTicketSystem);
  }

  createParkingLotStage(
    doc: IParkingLotStageSchema,
  ): Observable<InsertWriteOpResult<{ _id: string }>> {
    return undefined;
  }
}
