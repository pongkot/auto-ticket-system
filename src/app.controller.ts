import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { map, mergeAll, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('create-parking-lot')
  createParkingLot(): Observable<any> {
    return this.appService.createPackingLotStage();
  }

  @Get('create-ticket')
  createTicket(@Query('plate') licencePlate: string): Observable<any> {
    const gateAddress = {
      x: 0,
      y: 0,
    };
    return this.appService.listPackingLotAvaliable().pipe(
      mergeAll(),
      mergeMap((slot: any) =>
        this.appService.getDistanceFromGate(slot.slotAddress, gateAddress).pipe(
          map((distance) => {
            slot['distance'] = distance;
            return slot;
          }),
        ),
      ),
      toArray(),
      map((docs) => {
        const list = _.sortBy(docs, 'distance');
        return list[0];
      }),
      mergeMap((doc) => this.appService.createTicket(licencePlate, doc)),
    );
  }

  @Get('leave-ticket')
  leaveTicket(@Query('plate') licencePlate: string): Observable<any> {
    return this.appService.leaveTicket(licencePlate);
  }

  @Get('status')
  getParkingLotStatus(): Observable<any> {
    return this.appService.getAvaliableSlot();
  }
}
