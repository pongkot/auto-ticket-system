import { ITicketService } from './interfaces/ITicketService';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Service } from '../constants';
import { IParkingLotStageService } from '../parking-lot-stage/interfaces/IParkingLotStageService';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { ParkingLotStageModel } from '../parking-lot-stage/ParkingLotStageModel';

@Injectable()
export class TicketService implements ITicketService {
  private logger: Logger = new Logger('TicketService');
  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStageService: IParkingLotStageService,
  ) {}

  createTicket(
    licencePlate: string,
    carSize: 's' | 'm' | 'l',
  ): Observable<{ ticketId: string; yourSlot: Array<string> }> {
    return this.parkingLotStageService.listAvailableParkingLot().pipe(
      toArray(),
      mergeMap((slotList: Array<ParkingLotStageModel>) =>
        this.parkingLotStageService.observeSlotForCarSize(slotList, carSize),
      ),
      mergeMap((slot: { available: number }) => {
        if (slot.available <= 0) {
          throw new HttpException(
            'No available parking lot',
            HttpStatus.NOT_FOUND,
          );
        }
        return this.parkingLotStageService.rangingAvailableAndShortDistanceSlot();
      }),
      mergeMap((availableSlotList: Array<ParkingLotStageModel>) => {
        const carDoc = {
          licencePlate,
          carSize,
        };
        return this.parkingLotStageService.parkingActivate(
          carDoc,
          availableSlotList,
        );
      }),
      mergeMap((ticket: { ticketId: string }) =>
        this.parkingLotStageService
          .searchParkingSlotByTicketId(ticket.ticketId)
          .pipe(
            toArray(),
            map((slotsList: Array<ParkingLotStageModel>) => {
              return {
                ticketId: ticket.ticketId,
                yourSlot: slotsList.map((Doc: ParkingLotStageModel) =>
                  Doc.getSlotId(),
                ),
              };
            }),
          ),
      ),
    );
  }
}
