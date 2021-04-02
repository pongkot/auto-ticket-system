import { ParkingLotStageModel } from '../../ParkingLotStageModel';

export const mockDataSetAllAvailable = [
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(1)
    .setSlotAddressLong(0),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(0),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(3)
    .setSlotAddressLong(0),
];
