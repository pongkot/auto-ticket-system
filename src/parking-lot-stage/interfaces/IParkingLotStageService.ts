import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';
import { ParkingLotStageModel } from '../ParkingLotStageModel';

export interface IParkingLotStageService {
  createParkingLot(size: 3 | 4): Observable<{ parkingLotId: Array<ObjectId> }>;

  listAvailableParkingLot(): Observable<ParkingLotStageModel>;

  listAvailableAndShortDistanceSlot(): Observable<ParkingLotStageModel>;

  observeSlotForCarSize(
    slotList: Array<ParkingLotStageModel>,
    carSize: 's' | 'm' | 'l',
  ): Observable<{ available: number }>;

  parkingActivate(
    carDoc: { licencePlate: string; carSize: 's' | 'm' | 'l' },
    availableSlot: ParkingLotStageModel,
  );
}
