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
import { map, toArray } from 'rxjs/operators';
import { mockDataSetAllAvailable } from './mock-data/mockDataSetAllAvailable';
import { mockDateSetLat2Unavailable } from './mock-data/mockDateSetLat2Unavailable';
import { mockUnsortedDataSetAllAvailable } from './mock-data/mockUnsortedDataSetAllAvailable';
import * as _ from 'lodash';
import { mockUnsortedDataSetLat1Unavailable } from './mock-data/mockUnsortedDataSetLat1Unavailable';

describe('ParkingLotStageService', () => {
  let parkingLotStageService: IParkingLotStageService;
  let parkingLotStageRepository: IParkingLotStageRepository;
  let parkingLotStageMapping: ParkingLotStageMapping;

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
    parkingLotStageMapping = moduleRef.get<ParkingLotStageMapping>(
      ParkingLotStageMapping,
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
    it('parking lot size is 3 (available all) then get 3 car size S', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAllAvailable, 's')
        .toPromise();
      expect(result).toStrictEqual({ available: 3 });
    });

    it('parking lot size is 3 (available all) then get 1 car size M', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAllAvailable, 'm')
        .toPromise();
      expect(result).toStrictEqual({ available: 1 });
    });

    it('parking lot size is 3 (available all) then get 1 car size L', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDataSetAllAvailable, 'l')
        .toPromise();
      expect(result).toStrictEqual({ available: 1 });
    });

    it('parking lost size is 3 (lat 2 unavailable) then get 2 car size S', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDateSetLat2Unavailable, 's')
        .toPromise();
      expect(result).toStrictEqual({ available: 2 });
    });

    it('parking lost size is 3 (lat 2 unavailable) then get 0 car size M', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDateSetLat2Unavailable, 'm')
        .toPromise();
      expect(result).toStrictEqual({ available: 0 });
    });

    it('parking lost size is 3 (lat 2 unavailable) then get 0 car size L', async () => {
      const result = await parkingLotStageService
        .observeSlotForCarSize(mockDateSetLat2Unavailable, 'l')
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
        .rangingAvailableAndShortDistanceSlot()
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
        .rangingAvailableAndShortDistanceSlot()
        .toPromise();

      const expectedDoc = mockUnsortedDataSetAllAvailable.filter(
        (doc) => doc.getSlotAddressLat() > 1,
      );

      expect(result).toStrictEqual(_.sortBy(expectedDoc, 'slotAddressLat'));
    });
  });

  // describe('::listAvailableAndShortDistanceSlot', () => {
  //   it('parking lot (3 doc) unsorted (available all) then get 3 slot and sort short distance', async () => {
  //     jest
  //       .spyOn(parkingLotStageRepository, 'listParkingLotStage')
  //       .mockImplementation(() => from(mockUnsortedDataSetAllAvailable));
  //
  //     const received = await parkingLotStageService
  //       .listAvailableAndShortDistanceSlot()
  //       .pipe(toArray())
  //       .toPromise();
  //
  //     const expected = _.sortBy(
  //       mockUnsortedDataSetAllAvailable,
  //       'slotAddressLat',
  //     );
  //
  //     console.log({ received, expected });
  //
  //     expect(received).toStrictEqual(expected);
  //   });
  // });
});
