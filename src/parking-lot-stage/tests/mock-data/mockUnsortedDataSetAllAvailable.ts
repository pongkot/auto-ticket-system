import { ParkingLotStageModel } from '../../ParkingLotStageModel';

export const mockUnsortedDataSetAllAvailable = [
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(0)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(1)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(1),
];
