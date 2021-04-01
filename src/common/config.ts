import * as _ from 'lodash';
import { IConfig } from './interfaces';
import { parking1x3, parking1x4 } from '../../htdocs/config';

const ENV = process.env;

export const config: IConfig = {
  parkingLotSize: { 3: parking1x3, 4: parking1x4 },
  gateAddress: {
    lat: 0,
    long: 0,
  },
  database: {
    autoTicketSystem: {
      host: _.get(ENV, 'AUTO_TICKET_SYSTEM_DB_HOST', 'localhost'),
      user: _.get(ENV, 'AUTO_TICKET_SYSTEM_DB_USER', ''),
      password: _.get(ENV, 'AUTO_TICKET_SYSTEM_DB_PASS', ''),
      port: _.toNumber(_.get(ENV, 'AUTO_TICKET_SYSTEM_DB_PORT', 27017)),
      database: _.get(ENV, 'AUTO_TICKET_SYSTEM_DB_NAME', 'auto_ticket_system'),
    },
  },
};
