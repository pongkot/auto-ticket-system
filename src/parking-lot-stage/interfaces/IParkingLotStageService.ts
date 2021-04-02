import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';
import { ParkingLotStageModel } from '../ParkingLotStageModel';

export interface IParkingLotStageService {
  createParkingLot(size: 3 | 4): Observable<{ parkingLotId: Array<ObjectId> }>;

  listAvailableParkingLot(): Observable<ParkingLotStageModel>;

  observeSlotForCarSize(
    slotList: Array<ParkingLotStageModel>,
    carSize: 's' | 'm' | 'l',
  ): Observable<{ available: number }>;

  parkingActivate(
    carDoc: { licencePlate: string; carSize: 's' | 'm' | 'l' },
    availableSlot: Array<ParkingLotStageModel>,
  ): Observable<{ ticketId: string }>;

  searchParkingSlotByTicketId(id: string): Observable<ParkingLotStageModel>;

  rangingAvailableAndShortDistanceSlot(): Observable<
    Array<ParkingLotStageModel>
  >;

  getSummaryParkingLotStage(): Observable<{
    capacity: number;
    parking: {
      s: number;
      m: number;
      l: number;
      total: number;
    };
    available: {
      s: number;
      m: number;
      l: number;
    };
  }>;
}
