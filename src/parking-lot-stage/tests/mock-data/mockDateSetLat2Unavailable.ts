import { ParkingLotStageModel } from '../../ParkingLotStageModel';

export const mockDateSetLat2Unavailable = [
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(1)
    .setSlotAddressLong(0),
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(2)
    .setSlotAddressLong(0),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(3)
    .setSlotAddressLong(0),
];
