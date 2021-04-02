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

describe('ParkingLotStageService', () => {
  let parkingLotStageService: IParkingLotStageService;
  let parkingLotStageRepository: IParkingLotStageRepository;
  // let parkingLotStageMapping: ParkingLotStageMapping;

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

  describe('listAvailableParkingLot', () => {
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
});
