import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { CONFIG, Mapping, Repository } from '../constants';
import { IConfig, IParkingLotSize } from '../common/interfaces';
import { IParkingLotStageRepository } from './interfaces/IParkingLotStageRepository';
import { ParkingLotStageMapping } from './ParkingLotStageMapping';
import { filter, map, mergeMap, reduce, toArray } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import { ParkingLotStageModel } from './ParkingLotStageModel';
import { IParkingLotStageSchema } from '../../htdocs/database/auto-ticket-system';
import * as _ from 'lodash';

interface IAddress {
  lat: number;
  long: number;
}

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
        this.logger.log('Create parking lot stage success');
        return { parkingLotId: result };
      }),
    );
  }

  listAvailableParkingLot(): Observable<ParkingLotStageModel> {
    return this.parkingLotStageRepository
      .listParkingLotStage()
      .pipe(
        filter((Doc: ParkingLotStageModel) => _.eq(Doc.getAvailable(), true)),
      );
  }

  private getDistanceFromGate(slotAddress: IAddress): number {
    const gateAddress = this.config.gateAddress;
    return ParkingLotStageService.getDistance(slotAddress, gateAddress);
  }

  private static getDistance(a: IAddress, b: IAddress): number {
    return Math.sqrt(Math.pow(a.lat - b.lat, 2) - Math.pow(a.long - b.long, 2));
  }

  listAvailableAndShortDistanceSlot(): Observable<ParkingLotStageModel> {
    return this.listAvailableParkingLot().pipe(
      map((Doc: ParkingLotStageModel) => {
        return {
          Doc,
          distance: this.getDistanceFromGate(Doc.getSlotAddress()),
        };
      }),
      toArray(),
      map((Docs: Array<{ Doc: ParkingLotStageModel; distance: number }>) => {
        return _.sortBy(Docs, 'distance')[0].Doc;
      }),
    );
  }

  observeSlotForCarSize(
    slotList: Array<ParkingLotStageModel>,
    carSize: 's' | 'm' | 'l',
  ): Observable<{ available: number }> {
    return this.observeSlotForCarSSize(slotList);
  }

  private observeSlotForCarSSize(
    slotList: Array<ParkingLotStageModel>,
  ): Observable<{ available: number }> {
    return from(slotList).pipe(
      filter((slot: ParkingLotStageModel) => _.eq(slot.getAvailable(), true)),
      toArray(),
      map((docs: Array<ParkingLotStageModel>) => ({ available: _.size(docs) })),
    );
  }

  parkingActivate(
    carDoc: { licencePlate: string; carSize: 's' | 'm' | 'l' },
    availableSlot: ParkingLotStageModel,
  ) {
    //
  }
}
