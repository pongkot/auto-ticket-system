import { IParkingLotStageService } from '../interfaces/IParkingLotStageService';
import { ParkingLotStageMapping } from '../ParkingLotStageMapping';
import { ParkingLotStageService } from '../ParkingLotStageService';
import { ParkingLotStageRepository } from '../ParkingLotStageRepository';
import { Test } from '@nestjs/testing';
import { CommonModule } from '../../common';
import { ParkingLotStageController } from '../ParkingLotStageController';
import { Mapping, Repository, Service } from '../../constants';
import { IParkingLotStageRepository } from '../interfaces/IParkingLotStageRepository';
import { from } from 'rxjs';
import { ParkingLotStageModel } from '../ParkingLotStageModel';
import { toArray } from 'rxjs/operators';
import {
  mockDataSetAllAvailable,
  mockDataSet3x3AllAvailable,
} from './mock-data/mockDataSetAllAvailable';
import { mockDateSetLat2Unavailable } from './mock-data/mockDateSetLat2Unavailable';
import { mockUnsortedDataSetAllAvailable } from './mock-data/mockUnsortedDataSetAllAvailable';
import * as _ from 'lodash';
import {
  mockUnsortedDataSetLat1Unavailable,
  mockUnsortedDataSetLat1Long2Unavailable,
} from './mock-data/mockUnsortedDataSetLat1Unavailable';
import { mockDataSetAnyLat1Unavailable } from './mock-data/mockDataSetLong2Unavilable';

describe('ParkingLotStageService', () => {
  let parkingLotStageService: IParkingLotStageService;
  let parkingLotStageRepository: IParkingLotStageRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommonModule],
      controllers: [ParkingLotStageController],
      providers: [
        {
          provide: Mapping.PARKING_LOT_STAGE,
          useClass: ParkingLotStageMapping,
        },
        {
          provide: Repository.PARKING_LOT_STAGE,
          useClass: ParkingLotStageRepository,
        },
        {
          provide: Service.PARKING_LOT_STAGE,
          useClass: ParkingLotStageService,
        },
      ],
    }).compile();

    parkingLotStageService = moduleRef.get<IParkingLotStageService>(
      ParkingLotStageService,
    );
    parkingLotStageRepository = moduleRef.get<IParkingLotStageRepository>(
      ParkingLotStageRepository,
    );
  });

  describe('::listAvailableParkingLot', () => {
    it('parking lot size is 3 (available all) then retrieve get 3 parking lot', async () => {
      const mock = [
        new ParkingLotStageModel().setAvailable(true),
        new ParkingLotStageModel().setAvailable(true),
        new ParkingLotStageModel().setAvailable(true),
      ];

      jest
        .spyOn(parkingLotStageRepository, 'listParkingLotStage')
        .mockImplementation(() => from(mock));

      const result = await parkingLotStageService
        .listAvailableParkingLot()
        .pipe(toArray())
        .toPromise();

      expect(result).toStrictEqual(mock);
    });

    it('parking lot size is 3 (available 2) then retrieve get 2 parking lot', async () => {
      const mock = [
        new ParkingLotStageModel().setAvailable(true),
        new ParkingLotStageModel().setAvailable(false),
        new ParkingLotStageModel().setAvailable(true),
      ];

      jest
        .spyOn(parkingLotStageRepository, 'listParkingLotStage')
        .mockImplementation(() => from(mock));

      const result = await parkingLotStageService
        .listAvailableParkingLot()
        .pipe(toArray())
        .toPromise();

      expect(result).toStrictEqual([
        new ParkingLotStageModel().setAvailable(true),
        new ParkingLotStageModel().setAvailable(true),
      ]);
    });
  });

  describe('::observeSlotForCarSize', () => {
    it('parking lot size 3 (available all) then get 3 car size S', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAllAvailable, 's')
        .toPromise();
      expect(result).toStrictEqual({ available: 3 });
    });

    it('parking lot size 3 (available all) then get 1 car size M', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAllAvailable, 'm')
        .toPromise();
      expect(result).toStrictEqual({ available: 1 });
    });

    it('parking lot size 3 (available all) then get 1 car size L', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAllAvailable, 'l')
        .toPromise();
      expect(result).toStrictEqual({ available: 1 });
    });

    it('parking lot size 3 (lat 2 unavailable) then get 2 car size S', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDateSetLat2Unavailable, 's')
        .toPromise();
      expect(result).toStrictEqual({ available: 2 });
    });

    it('parking lot size 3 (lat 2 unavailable) then get 0 car size M', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDateSetLat2Unavailable, 'm')
        .toPromise();
      expect(result).toStrictEqual({ available: 0 });
    });

    it('parking lot size 3 (lat 2 unavailable) then get 0 car size L', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDateSetLat2Unavailable, 'l')
        .toPromise();
      expect(result).toStrictEqual({ available: 0 });
    });

    it('parking lot size 3x3 (available all) then get 9 car size s', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSet3x3AllAvailable, 's')
        .toPromise();
      expect(result).toStrictEqual({ available: 9 });
    });

    it('parking lot size 3x3 (available all) then get 3 car size m', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSet3x3AllAvailable, 'm')
        .toPromise();
      expect(result).toStrictEqual({ available: 3 });
    });

    it('parking lot size 3x3 (available all) then get 3 car size L', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSet3x3AllAvailable, 'l')
        .toPromise();
      expect(result).toStrictEqual({ available: 3 });
    });

    it('parking lot size 3x3 (any lat 1 unavailable) then get 0 car size m', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAnyLat1Unavailable, 'm')
        .toPromise();
      expect(result).toStrictEqual({ available: 0 });
    });

    it('parking lot size 3x3 (any lat 2 unavailable) then get 0 car size l', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAnyLat1Unavailable, 'l')
        .toPromise();
      expect(result).toStrictEqual({ available: 0 });
    });
  });

  describe('::rangingAvailableAndShortDistanceSlot', () => {
    it('parking lot (3 doc) unsorted (available all) then get 3 slot and sort by short distance', async () => {
      jest
        .spyOn(parkingLotStageRepository, 'listParkingLotStage')
        .mockImplementation(() => from(mockUnsortedDataSetAllAvailable));

      const result = await parkingLotStageService
        .rangingAvailableAndShortDistanceSlot('s')
        .toPromise();

      expect(result).toStrictEqual(
        _.sortBy(mockUnsortedDataSetAllAvailable, 'slotAddressLat'),
      );
    });

    it('parking lot (3 doc) unsorted (lat 1 unavailable) then get 2 slot and sort by short distance', async () => {
      jest
        .spyOn(parkingLotStageRepository, 'listParkingLotStage')
        .mockImplementation(() => from(mockUnsortedDataSetLat1Unavailable));

      const result = await parkingLotStageService
        .rangingAvailableAndShortDistanceSlot('s')
        .toPromise();

      const expectedDoc = mockUnsortedDataSetAllAvailable.filter(
        (doc) => doc.getSlotAddressLat() > 1,
      );

      expect(result).toStrictEqual(_.sortBy(expectedDoc, 'slotAddressLat'));
    });

    it('parking lot (3x3) unsorted (lat 1 long 2 unavailable) then get 4 slot and sort by short distance for car size M', async () => {
      jest
        .spyOn(parkingLotStageRepository, 'listParkingLotStage')
        .mockImplementation(() =>
          from(mockUnsortedDataSetLat1Long2Unavailable),
        );

      const received = await parkingLotStageService
        .rangingAvailableAndShortDistanceSlot('m')
        .toPromise();

      const expected = [
        new ParkingLotStageModel()
          .setAvailable(true)
          .setSlotAddressLat(0)
          .setSlotAddressLong(1),
        new ParkingLotStageModel()
          .setAvailable(true)
          .setSlotAddressLat(0)
          .setSlotAddressLong(2),
        new ParkingLotStageModel()
          .setAvailable(true)
          .setSlotAddressLat(0)
          .setSlotAddressLong(3),
        new ParkingLotStageModel()
          .setAvailable(true)
          .setSlotAddressLat(1)
          .setSlotAddressLong(3),
      ];

      expect(received).toStrictEqual(expected);
    });

    it('parking lot (3x3) unsorted (lat 1 long 2 unavailable then get 6 slot and sort by short distance for car size L', async () => {
      jest
        .spyOn(parkingLotStageRepository, 'listParkingLotStage')
        .mockImplementation(() =>
          from(mockUnsortedDataSetLat1Long2Unavailable),
        );

      const received = await parkingLotStageService
        .rangingAvailableAndShortDistanceSlot('l')
        .toPromise();

      const expected = [
        new ParkingLotStageModel()
          .setAvailable(true)
          .setSlotAddressLat(0)
          .setSlotAddressLong(1),
        new ParkingLotStageModel()
          .setAvailable(true)
          .setSlotAddressLat(2)
          .setSlotAddressLong(1),
        new ParkingLotStageModel()
          .setAvailable(true)
          .setSlotAddressLat(2)
          .setSlotAddressLong(1),
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

      expect(received).toStrictEqual(expected);
    });
  });
});
