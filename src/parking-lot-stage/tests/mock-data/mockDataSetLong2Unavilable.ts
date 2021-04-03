import { ParkingLotStageModel } from '../../ParkingLotStageModel';

export const mockDataSetAnyLat2Unavailable = [
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
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(1)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(2)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(3)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(1)
    .setSlotAddressLong(2),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(2),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(3)
    .setSlotAddressLong(2),
];
