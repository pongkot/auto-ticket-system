import { MappingCore } from '../common';
import { IParkingLotStageSchema } from '../../htdocs/database/auto-ticket-system';
import { ParkingLotStageModel } from './ParkingLotStageModel';

export class ParkingLotStageMapping extends MappingCore<
  IParkingLotStageSchema,
  ParkingLotStageModel
> {
  toModel(context: IParkingLotStageSchema): ParkingLotStageModel {
    return new ParkingLotStageModel();
  }

  toObject(context: ParkingLotStageModel): IParkingLotStageSchema {
    return {
      _id: undefined,
      assign: { licencePlate: '', size: '', ticketId: '' },
      available: false,
      slotAddress: { lat: 0, long: 0 },
      slotId: '',
    };
  }
}
