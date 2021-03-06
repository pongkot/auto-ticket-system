import { IDatabaseOption } from './IDatabaseOption';
import { IParkingLotSize } from './IParkingLotSize';

export interface IConfig {
  database: {
    autoTicketSystem: IDatabaseOption;
  };
  parkingLotSize: {
    '3': Array<IParkingLotSize>;
    '4': Array<IParkingLotSize>;
    square3: Array<IParkingLotSize>;
  };
  gateAddress: {
    lat: number;
    long: number;
  };
}
