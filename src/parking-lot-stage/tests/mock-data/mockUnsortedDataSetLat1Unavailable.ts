import { ParkingLotStageModel } from '../../ParkingLotStageModel';

export const mockUnsortedDataSetLat1Unavailable = [
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
];

export const mockUnsortedDataSet3x3Lat1Long2Unavailable = [
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
    .setAvailable(true)
    .setSlotAddressLat(1)
    .setSlotAddressLong(3),
  new ParkingLotStageModel()
    .setAvailable(true)
    .setSlotAddressLat(2)
    .setSlotAddressLong(3),
];
