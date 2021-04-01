import { Observable } from 'rxjs';
import { ObjectId } from 'mongodb';
import { ParkingLotStageModel } from '../ParkingLotStageModel';

export interface IParkingLotStageRepository {
  createParkingLotStage(
    Doc: ParkingLotStageModel,
  ): Observable<{ _id: ObjectId }>;

  listParkingLotStage(): Observable<ParkingLotStageModel>;

  updateParkingLotStage<IFilter, IUpdateValue>(
    filter: IFilter,
    doc: IUpdateValue,
  ): Observable<any>;
}
