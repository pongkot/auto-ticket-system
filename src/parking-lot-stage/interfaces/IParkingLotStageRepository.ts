import { Observable } from 'rxjs';
import { InsertWriteOpResult } from 'mongodb';
import { ParkingLotStageModel } from '../ParkingLotStageModel';

export interface IParkingLotStageRepository {
  createParkingLotStage(Doc: ParkingLotStageModel): Observable<any>;
}
