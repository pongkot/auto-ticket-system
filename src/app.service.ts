import { Injectable } from '@nestjs/common';
import { Mongo } from './Mongo';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import * as _ from 'lodash';

@Injectable()
export class AppService extends Mongo<any> {
  constructor() {
    super();
    this.setDatabaseOption({
      database: 'auto_ticket_system',
      host: 'localhost',
      port: 27017,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  createPackingLotStage(): Observable<any> {
    const slotList = [
      {
        slotId: 'l-1',
        slotAddress: {
          x: 2,
          y: 0,
        },
        available: true,
        assign: null,
      },
      {
        slotId: 'l-2',
        slotAddress: {
          x: 3,
          y: 0,
        },
        available: true,
        assign: null,
      },
      {
        slotId: 'l-3',
        slotAddress: {
          x: 1,
          y: 0,
        },
        available: true,
        assign: null,
      },
    ];
    return from(slotList).pipe(
      mergeMap((slot) => this.collection('parkingLotStage').insertOne(slot)),
    );
  }

  listPackingLotAvaliable(): Observable<any> {
    const cursor = this.collection('parkingLotStage').find({ available: true });
    return from(cursor);
  }

  getDistanceFromGate(
    address: { x: number; y: number },
    gateAddress: { x: number; y: number },
  ): Observable<number> {
    const distance = Math.sqrt(
      Math.pow(address.x - gateAddress.x, 2) -
        Math.pow(address.y - gateAddress.y, 2),
    );
    return of(distance);
  }

  getDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) - Math.pow(a.y - b.y, 2));
  }

  createTicket(licencePlate: string, slot: any): Observable<any> {
    const _id = new ObjectId(slot._id);
    return of(_id).pipe(
      mergeMap((id) =>
        this.collection('parkingLotStage').updateOne(
          { _id: id },
          {
            $set: {
              available: false,
              assign: licencePlate,
            },
          },
        ),
      ),
    );
  }

  leaveTicket(licencePlate: string): Observable<any> {
    return of(licencePlate).pipe(
      mergeMap((plate) =>
        this.collection('parkingLotStage').updateOne(
          { assign: plate },
          {
            $set: {
              available: true,
              assign: null,
            },
          },
        ),
      ),
    );
  }

  getAvaliableSlot(): Observable<any> {
    const cursor = this.collection('parkingLotStage').find({ available: true });
    return from(cursor).pipe(
      map((docs) => ({
        message: 'slot avaliable',
        avaliable: _.size(docs),
      })),
    );
  }

  forMSize(): Observable<any> {
    const cursor = this.collection('parkingLotStage').find({ available: true });
    return from(cursor).pipe(
      map((docs: Array<any>) => {
        let m = 0;
        for (let i = 0, j = 1; i < _.size(docs); i++, j++) {
          if (docs[j]) {
            if (
              this.getDistance(docs[i].slotAddress, docs[j].slotAddress) === 1
            ) {
              m += 1;
              i += 1;
            }
          }
        }
        return m;
      }),
    );
  }
}
