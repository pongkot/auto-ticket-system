import { Mongo } from '../common';
import { IParkingLotStageRepository } from './interfaces/IParkingLotStageRepository';
import { from, Observable, of } from 'rxjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONFIG, Mapping } from '../constants';
import { IConfig } from '../common/interfaces';
import { ParkingLotStageMapping } from './ParkingLotStageMapping';
import { map, mergeMap, toArray } from 'rxjs/operators';
import {
  collectionName,
  IParkingLotStageSchema,
} from '../../htdocs/database/auto-ticket-system';
import { ParkingLotStageModel } from './ParkingLotStageModel';
import { InsertOneWriteOpResult } from 'mongodb';

@Injectable()
export class ParkingLotStageRepository
  extends Mongo<IParkingLotStageSchema>
  implements IParkingLotStageRepository {
  private readonly logger: Logger = new Logger('ParkingLotStageRepository');

  constructor(
    @Inject(CONFIG)
    private readonly config: IConfig,
    @Inject(Mapping.PARKING_LOT_STAGE)
    private readonly parkingLotStageMapping: ParkingLotStageMapping,
  ) {
    super();
    const { autoTicketSystem } = this.config.database;
    this.setDatabaseOption(autoTicketSystem);
  }

  createParkingLotStage(Doc: ParkingLotStageModel): Observable<any> {
    return of(Doc).pipe(
      map((Doc: ParkingLotStageModel) =>
        this.parkingLotStageMapping.toObject(Doc),
      ),
      mergeMap((doc: IParkingLotStageSchema) => this.insertDocOne(doc)),
      map((result: InsertOneWriteOpResult<IParkingLotStageSchema>) => ({
        _id: result.insertedId,
      })),
      toArray(),
    );
  }

  private insertDocOne(
    doc: IParkingLotStageSchema,
  ): Observable<InsertOneWriteOpResult<IParkingLotStageSchema>> {
    const cursor = this.collection(collectionName.PARKING_LOT_STAGE).insertOne(
      doc,
    );
    return from(cursor);
  }
}
