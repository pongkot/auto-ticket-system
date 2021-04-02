import { ITicketService } from './interfaces/ITicketService';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { Repository, Service } from '../constants';
import { IParkingLotStageService } from '../parking-lot-stage/interfaces/IParkingLotStageService';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';
import { ParkingLotStageModel } from '../parking-lot-stage/ParkingLotStageModel';
import { IParkingLotStageRepository } from '../parking-lot-stage/interfaces/IParkingLotStageRepository';
import { UpdateWriteOpResult } from 'mongodb';
import * as _ from 'lodash';

@Injectable()
export class TicketService implements ITicketService {
  private logger: Logger = new Logger('TicketService');
  constructor(
    @Inject(Service.PARKING_LOT_STAGE)
    private readonly parkingLotStageService: IParkingLotStageService,
    @Inject(Repository.PARKING_LOT_STAGE)
    private readonly parkingLotStageRepository: IParkingLotStageRepository,
  ) {}

  createTicket(
    licencePlate: string,
    carSize: 's' | 'm' | 'l',
  ): Observable<any> {
    return this.parkingLotStageRepository
      .searchParkingLotStage({ 'assign.licencePlate': licencePlate })
      .pipe(
        toArray(),
        tap((parkingLotList: Array<ParkingLotStageModel>) => {
          if (_.size(parkingLotList) >= 1) {
            throw new HttpException(
              'Licence plate has been used',
              HttpStatus.BAD_REQUEST,
            );
          }
        }),
        mergeMap(() => this.parkingLotStageService.listAvailableParkingLot()),
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

  leaveTicket(ticketId: string): Observable<{ message: string }> {
    const cursor = this.parkingLotStageRepository.updateAllParkingLotStage(
      { 'assign.ticketId': ticketId },
      {
        assign: {
          ticketId: '',
          carSize: '',
          licencePlate: '',
        },
        available: true,
      },
    );
    return from(cursor).pipe(
      map((response: UpdateWriteOpResult) => {
        const { nModified } = response.result;
        if (nModified > 0) {
          return {
            message: 'Thank you for coming',
          };
        } else {
          return {
            message: 'Ticket invalid, please contact officer',
          };
        }
      }),
    );
  }
}
