import { ITicketService } from './interfaces/ITicketService';
import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Service } from '../constants';
import { IParkingLotStageService } from '../parking-lot-stage/interfaces/IParkingLotStageService';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';
import { ParkingLotStageModel } from '../parking-lot-stage/ParkingLotStageModel';

@Injectable()
export class TicketService implements ITicketService {
  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStageService: IParkingLotStageService,
  ) {}

  createTicket(
    licencePlate: string,
    carSize: 's' | 'm' | 'l',
  ): Observable<any> {
    return this.parkingLotStageService.listAvailableParkingLot().pipe(
      toArray(),
      mergeMap((slotList: Array<ParkingLotStageModel>) =>
        this.parkingLotStageService.observeSlotForCarSize(slotList, 's'),
      ),
      mergeMap(() =>
        this.parkingLotStageService.listAvailableAndShortDistanceSlot(),
      ),
    );
  }
}
