import { Observable } from 'rxjs';

export interface IParkingLotStageService {
  createParkingLot(size: 3 | 4): Observable<{ parkingLotId: Array<string> }>;
}
