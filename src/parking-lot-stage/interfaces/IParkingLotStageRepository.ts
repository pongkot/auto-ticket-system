import { Observable } from 'rxjs';
import { InsertWriteOpResult } from 'mongodb';
import { IParkingLotStageSchema } from '../../../htdocs/database/auto-ticket-system';

export interface IParkingLotStageRepository {
  createParkingLotStage(
    doc: IParkingLotStageSchema,
  ): Observable<InsertWriteOpResult<{ _id: string }>>;
}
