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
import { ISummaryParkingLotStage } from './interfaces/ISummaryParkingLotStage';

interface IAddress {
  lat: number;
  long: number;
}

interface IA {
  Doc: ParkingLotStageModel;
  distance: number;
}

interface IB {
  _id: ObjectId;
  doc: {
    assign: {
      licencePlate: string;
      carSize: string;
      ticketId: string;
    };
    available: boolean;
  };
}

interface IC {
  s: number;
  m: number;
  l: number;
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

  createParkingLot(
    size: '3' | '4' | 'square3',
  ): Observable<{ parkingLotId: Array<ObjectId> }> {
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
    return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.long - b.long, 2));
  }

  rangingAvailableAndShortDistanceSlot(
    carSize: 's' | 'm' | 'l',
  ): Observable<Array<ParkingLotStageModel>> {
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
      map((e) => {
        const r = _.groupBy(e, 'Doc.slotAddressLong');
        // console.log(r);
        const a = [];
        Object.keys(r).forEach((i) => {
          a.push(r[i]);
        });
        const j = {
          s: 1,
          m: 2,
          l: 3,
        };
        console.log(a);
        console.log(j[carSize]);
        const b = a.filter((o) => _.size(o) >= j[carSize]); // TODO send size
        // console.log(b);
        // console.log(c);
        return _.flatMapDeep(b);
      }),
      map((Docs: Array<IA>) => Docs.map((list: IA) => list.Doc).slice(0, 3)),
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
        const objects = _.sortBy(
          _.groupBy(docs, 'slotAddressLat'),
          'slotAddressLong',
        );

        let n = 0;
        for (let a = 0; a < _.size(objects); a++) {
          for (let b = 0, c = 1; b < _.size(objects[a]); b += 1, c += 1) {
            if (objects[a][c]) {
              if (
                ParkingLotStageService.getDistance(
                  objects[a][b].getSlotAddress(),
                  objects[a][c].getSlotAddress(),
                ) === 1
              ) {
                n += 1;
                b += 2;
              }
            }
          }
        }

        return n;
      }),
      map((availableSlotTotal: number) => ({ available: availableSlotTotal })),
    );
  }

  private observeSlotForCarLSize(
    slotList: Array<ParkingLotStageModel>,
  ): Observable<{ available: number }> {
    return from(slotList).pipe(
      filter((slot: ParkingLotStageModel) => _.eq(slot.getAvailable(), true)),
      toArray(),
      map((docs: Array<ParkingLotStageModel>) => {
        const objects = _.sortBy(
          _.groupBy(docs, 'slotAddressLat'),
          'slotAddressLong',
        );
        const object2 = _.groupBy(docs, 'slotAddressLong');
        const object3 = [];
        Object.keys(object2).forEach((i) => {
          object3.push([object2[i]]);
        });
        let av = 0;
        for (let i = 0; i < _.size(object3); i++) {
          for (let j = 0, k = 1, l = 2; j < _.size(object3[i]); j++, k++, l++) {
            const object4 = _.sortBy(object3[i][j], 'slotAddressLat');
            // console.log(_.sortBy(object3[i][j], 'slotAddressLat'));
            const a = object4[j];
            const b = object4[k];
            const c = object4[l];

            if (c) {
              const d1 = ParkingLotStageService.getDistance(
                a.getSlotAddress(),
                b.getSlotAddress(),
              );
              const d2 = ParkingLotStageService.getDistance(
                a.getSlotAddress(),
                c.getSlotAddress(),
              );
              if (Math.abs(d1 - d2) === 1) {
                av += 1;
              }
            }
          }
        }
        return av;

        // let n = 0;
        // for (let a = 0; a < _.size(objects); a++) {
        //   for (
        //     let b = 0, c = 1, d = 1;
        //     b < _.size(objects[a]);
        //     b += 1, c += 1, d += 1
        //   ) {
        //     if (objects[a][d]) {
        //       if (
        //         ParkingLotStageService.getDistance(
        //           objects[a][b].getSlotAddress(),
        //           objects[a][c].getSlotAddress(),
        //         ) === 1 &&
        //         ParkingLotStageService.getDistance(
        //           objects[a][b].getSlotAddress(),
        //           objects[a][d].getSlotAddress(),
        //         ) === 1
        //       ) {
        //         n += 1;
        //         b += 3;
        //       }
        //     }
        //   }
        // }
        //
        // return n;
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
      mergeMap((list: IB) =>
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

  getSummaryParkingLotStage(): Observable<ISummaryParkingLotStage> {
    const parkingLotStageList = this.parkingLotStageRepository.listParkingLotStage();
    return parkingLotStageList.pipe(
      toArray(),
      mergeMap(async (list: Array<ParkingLotStageModel>) => {
        const availableList = list.filter((doc: ParkingLotStageModel) =>
          _.eq(doc.getAvailable(), true),
        );
        const capacity = _.size(list);
        const parkingNow = ParkingLotStageService.getParkingNowGroupByCarSize(
          list,
        );
        const availableNow = await this.getSlotAvailableNowGroupByCarSize(
          availableList,
        );
        const parkingTotal = _.sum([parkingNow.s, parkingNow.m, parkingNow.l]);
        return {
          capacity,
          parking: {
            small: parkingNow.s,
            medium: parkingNow.m,
            large: parkingNow.l,
            total: parkingTotal,
          },
          available: {
            small: availableNow.s,
            medium: availableNow.m,
            large: availableNow.l,
          },
        };
      }),
    );
  }

  private static getParkingSize(list: any) {
    return _.size(_.groupBy(list, 'ticketId'));
  }

  private static getParkingNowGroupByCarSize(
    list: Array<ParkingLotStageModel>,
  ): IC {
    const docs = _.groupBy(list, 'carSize');
    const s: number = ParkingLotStageService.getParkingSize(docs['s']);
    const m: number = ParkingLotStageService.getParkingSize(docs['m']);
    const l: number = ParkingLotStageService.getParkingSize(docs['l']);
    return { s, m, l };
  }

  private async getSlotAvailableNowGroupByCarSize(
    list: Array<ParkingLotStageModel>,
  ): Promise<IC> {
    const s = await this.observeSlotForCarSSize(list)
      .pipe(map((result) => result.available))
      .toPromise();
    const m = await this.observeSlotForCarMSize(list)
      .pipe(map((result) => result.available))
      .toPromise();
    const l = await this.observeSlotForCarLSize(list)
      .pipe(map((result) => result.available))
      .toPromise();
    return { s, m, l };
  }
}
