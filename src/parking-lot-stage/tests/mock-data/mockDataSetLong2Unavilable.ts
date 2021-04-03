import { ParkingLotStageModel } from '../../ParkingLotStageModel';

export const mockDataSetAnyLat1Unavailable = [
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(0)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(1)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(1),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(0)
    .setSlotAddressLong(2),
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(1)
    .setSlotAddressLong(2),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(2),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(0)
    .setSlotAddressLong(3),
  new ParkingLotStageModel()
    .setAvailable(false)
    .setSlotAddressLat(1)
    .setSlotAddressLong(3),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(3),
];
