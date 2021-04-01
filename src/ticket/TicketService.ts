import { ITicketService } from './interfaces/ITicketService';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Service } from '../constants';
import { IParkingLotStageService } from '../parking-lot-stage/interfaces/IParkingLotStageService';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';
import { ParkingLotStageModel } from '../parking-lot-stage/ParkingLotStageModel';
import { ObjectId } from 'mongodb';

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
      mergeMap((slot: { available: number }) => {
        if (slot.available <= 0) {
          throw new HttpException(
            'No available parking lot',
            HttpStatus.NOT_FOUND,
          );
        }
        return this.parkingLotStageService.listAvailableAndShortDistanceSlot();
      }),
      mergeMap((availableSlot: ParkingLotStageModel) => {
        const carDoc = {
          licencePlate,
          carSize,
        };
        return this.parkingLotStageService.parkingActivate(
          carDoc,
          availableSlot,
        );
      }),
    );
  }
}
