import { ParkingLotStageModel } from '../../ParkingLotStageModel';

export const mockUnsortedDataSetLat1Unavailable = [
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(3)
    .setSlotAddressLong(0),
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(1)
    .setSlotAddressLong(0),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(0),
];
