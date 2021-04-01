import { MappingCore } from '../common';
import { IParkingLotStageSchema } from '../../htdocs/database/auto-ticket-system';
import { ParkingLotStageModel } from './ParkingLotStageModel';

export class ParkingLotStageMapping extends MappingCore<
  IParkingLotStageSchema,
  ParkingLotStageModel
> {
  toModel(context: IParkingLotStageSchema): ParkingLotStageModel {
    return new ParkingLotStageModel()
      .setId(context._id)
      .setSlotId(context.slotId)
      .setSlotAddressLat(context.slotAddress.lat)
      .setSlotAddressLong(context.slotAddress.long)
      .setAvailable(context.available)
      .setTicketId(context.assign.ticketId)
      .setLicencePlate(context.assign.licencePlate)
      .setSize(context.assign.size);
  }

  toObject(context: ParkingLotStageModel): IParkingLotStageSchema {
    return {
      _id: context.getId(),
      assign: {
        licencePlate: context.getLicencePlate(),
        size: context.getSize(),
        ticketId: context.getTicketId(),
      },
      available: context.getAvailable(),
      slotAddress: {
        lat: context.getSlotAddressLat(),
        long: context.getSlotAddressLong(),
      },
      slotId: context.getSlotId(),
    };
  }
}
