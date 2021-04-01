import { Module } from '@nestjs/common';
import { CONFIG } from '../constants';
import { config } from './config';

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
