import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { CONFIG, Mapping, Repository } from '../constants';
import { IConfig, IParkingLotSize } from '../common/interfaces';
import { IParkingLotStageRepository } from './interfaces/IParkingLotStageRepository';
import { ParkingLotStageMapping } from './ParkingLotStageMapping';
import { map, mergeMap, reduce, tap } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import { ParkingLotStageModel } from './ParkingLotStageModel';
import { IParkingLotStageSchema } from '../../htdocs/database/auto-ticket-system';

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

  createParkingLot(size: 3 | 4): Observable<{ parkingLotId: Array<ObjectId> }> {
    const { parkingLotSize } = this.config;
    const parkingLotList = parkingLotSize[size];
    return from(parkingLotList).pipe(
      map((config: IParkingLotSize) => {
        const doc: IParkingLotStageSchema = {
          _id: new ObjectId(),
          assign: {
            carSize: config.assign.size,
            licencePlate: config.assign.licencePlate,
            ticketId: config.assign.ticketId,
          },
          available: config.available,
          slotAddress: {
            lat: config.slotAddress.lat,
            long: config.slotAddress.long,
          },
          slotId: config.slotId,
        };
        return doc;
      }),
      map((doc: IParkingLotStageSchema) =>
        this.parkingLotStageMapping.toModel(doc),
      ),
      mergeMap((Doc: ParkingLotStageModel) =>
        this.parkingLotStageRepository.createParkingLotStage(Doc),
      ),
      reduce((acc: Array<ObjectId>, curr: { _id: ObjectId }) => {
        acc.push(curr._id);
        return acc;
      }, []),
      map((result: Array<ObjectId>) => {
        return { parkingLotId: result };
      }),
    );
  }
}
