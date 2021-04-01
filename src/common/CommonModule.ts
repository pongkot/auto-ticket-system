import { Module } from '@nestjs/common';
import { CONFIG } from '../constants';
import * as _ from 'lodash';
import { IConfig } from './interfaces';

const ENV = process.env;

const config: IConfig = {
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

@Module({
  providers: [
    {
      provide: CONFIG,
      useValue: config,
    },
  ],
  exports: [CONFIG],
})
export class CommonModule {}
