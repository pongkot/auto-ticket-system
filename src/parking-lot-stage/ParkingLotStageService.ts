import { IParkingLotStageService } from './interfaces/IParkingLotStageService';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { CONFIG, Mapping, Repository } from '../constants';
import { IConfig, IParkingLotSize } from '../common/interfaces';
import { IParkingLotStageRepository } from './interfaces/IParkingLotStageRepository';
import { ParkingLotStageMapping } from './ParkingLotStageMapping';
import { filter, map, mergeMap, reduce, toArray } from 'rxjs/operators';
import { ObjectId, UpdateWriteOpResult } from 'mongodb';
import { ParkingLotStageModel } from './ParkingLotStageModel';
import { IParkingLotStageSchema } from '../htdocs/database/auto-ticket-system';
import * as _ from 'lodash';

interface IAddress {
  lat: number;
  long: number;
}

interface IA {
  Doc: ParkingLotStageModel;
  distance: number;
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

  rangingAvailableAndShortDistanceSlot(): Observable<
    Array<ParkingLotStageModel>
  > {
    return this.listAvailableParkingLot().pipe(
      map((Doc: ParkingLotStageModel) => {
        return {
          Doc,
          distance: this.getDistanceFromGate(Doc.getSlotAddress()),
        };
      }),
      toArray(),
      map((Docs: Array<IA>) => {
        return _.sortBy(Docs, 'distance');
      }),
      map((Docs: Array<IA>) => Docs.map((list: IA) => list.Doc).slice(0, 4)),
    );
  }

  observeSlotForCarSize(
    slotList: Array<ParkingLotStageModel>,
    carSize: 's' | 'm' | 'l',
  ): Observable<{ available: number }> {
    let cursor = of(null);
    switch (carSize) {
      case 'l':
        cursor = this.observeSlotForCarLSize(slotList);
        break;
      case 'm':
        cursor = this.observeSlotForCarMSize(slotList);
        break;
      case 's':
        cursor = this.observeSlotForCarSSize(slotList);
        break;
    }
    return cursor;
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

  private observeSlotForCarMSize(
    slotList: Array<ParkingLotStageModel>,
  ): Observable<{ available: number }> {
    return from(slotList).pipe(
      filter((slot: ParkingLotStageModel) => _.eq(slot.getAvailable(), true)),
      toArray(),
      map((docs: Array<ParkingLotStageModel>) => {
        let m = 0;
        for (let i = 0, j = 1; i < _.size(docs); i++, j++) {
          if (docs[j]) {
            if (
              ParkingLotStageService.getDistance(
                docs[i].getSlotAddress(),
                docs[j].getSlotAddress(),
              ) === 1
            ) {
              m += 1;
              i += 2;
            }
          }
        }
        return m;
      }),
      map((availableSlotTotal: number) => ({ available: availableSlotTotal })),
    );
  }

  // TODO refactor
  private observeSlotForCarLSize(
    slotList: Array<ParkingLotStageModel>,
  ): Observable<{ available: number }> {
    return from(slotList).pipe(
      filter((slot: ParkingLotStageModel) => _.eq(slot.getAvailable(), true)),
      toArray(),
      map((docs: Array<ParkingLotStageModel>) => {
        const a = _.sortBy(docs, 'slotAddressLat');
        let m = 0;
        for (let i = 0, j = 1, k = 2; i < _.size(a); i++, j++, k++) {
          if (a[k]) {
            if (
              _.eq(
                ParkingLotStageService.getDistance(
                  a[i].getSlotAddress(),
                  a[j].getSlotAddress(),
                ),
                1,
              ) &&
              _.eq(
                ParkingLotStageService.getDistance(
                  a[j].getSlotAddress(),
                  a[k].getSlotAddress(),
                ),
                1,
              )
            ) {
              m += 1;
              i += 3;
            }
          }
        }
        return m;
      }),
      map((availableSlotTotal: number) => ({ available: availableSlotTotal })),
    );
  }

  parkingActivate(
    carDoc: { licencePlate: string; carSize: 's' | 'm' | 'l' },
    availableSlot: Array<ParkingLotStageModel>,
  ): Observable<{ ticketId: string }> {
    const ticketId = new ObjectId().toHexString();
    const docs = [];
    const list = {
      s: 1,
      m: 2,
      l: 3,
    };

    for (let i = 0; i < list[carDoc.carSize]; i++) {
      const doc = availableSlot[i];
      docs.push({
        _id: doc.getId(),
        doc: {
          assign: {
            licencePlate: carDoc.licencePlate,
            carSize: carDoc.carSize,
            ticketId,
          },
          available: false,
        },
      });
    }

    return from(docs).pipe(
      mergeMap((list) =>
        this.parkingLotStageRepository
          .updateParkingLotStage(
            {
              _id: list._id,
            },
            {
              ...list.doc,
            },
          )
          .pipe(
            map((result: UpdateWriteOpResult) => {
              if (result.result.nModified < 1) {
                throw new HttpException(
                  "Something wrong, can't create ticket",
                  HttpStatus.NOT_FOUND,
                );
              }
              return { ticketId };
            }),
          ),
      ),
      reduce(
        (acc: { ticketId: string }, curr: { ticketId: string }) => {
          acc.ticketId = curr.ticketId;
          return acc;
        },
        { ticketId: '' },
      ),
    );
  }

  searchParkingSlotByTicketId(id: string): Observable<ParkingLotStageModel> {
    return this.parkingLotStageRepository.searchParkingLotStage({
      'assign.ticketId': id,
    });
  }

  getSummaryParkingLotStage(): Observable<any> {
    const parkingLotStageList = this.parkingLotStageRepository.listParkingLotStage();
    return parkingLotStageList.pipe(
      toArray(),
      mergeMap(async (list: Array<ParkingLotStageModel>) => {
        const availableList = list.filter((doc) =>
          _.eq(doc.getAvailable(), true),
        );
        const capacity = _.size(list);
        const parkingListBySize = _.groupBy(list, 'carSize');
        const parkingListBySSize = ParkingLotStageService.getParkingSize(
          parkingListBySize['s'],
        );
        const parkingListByMSize = ParkingLotStageService.getParkingSize(
          parkingListBySize['m'],
        );
        const parkingListByLSize = ParkingLotStageService.getParkingSize(
          parkingListBySize['l'],
        );
        const availableCarSSize = await this.observeSlotForCarSSize(
          availableList,
        ).toPromise();
        const availableCarMSize = await this.observeSlotForCarMSize(
          availableList,
        ).toPromise();
        const availableCarLSize = await this.observeSlotForCarLSize(
          availableList,
        ).toPromise();
        return {
          capacity,
          parking: {
            s: parkingListBySSize,
            m: parkingListByMSize,
            l: parkingListByLSize,
            total: _.sum([
              parkingListByMSize,
              parkingListBySSize,
              parkingListByLSize,
            ]),
          },
          available: {
            s: availableCarSSize.available,
            m: availableCarMSize.available,
            l: availableCarLSize.available,
          },
        };
      }),
    );
  }

  private static getParkingSize(list: Array<any>) {
    return _.size(_.groupBy(list, 'ticketId'));
  }
}
