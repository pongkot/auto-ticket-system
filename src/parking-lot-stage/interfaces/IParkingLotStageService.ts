import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';

export interface IParkingLotStageService {
  createParkingLot(size: 3 | 4): Observable<{ parkingLotId: Array<ObjectId> }>;
}
