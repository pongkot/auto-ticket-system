import { Module } from '@nestjs/common';
import { ReportController } from './ReportController';
import { ParkingLotStageModule } from '../parking-lot-stage/ParkingLotStageModule';
import { ReportService } from './ReportService';
import { Service } from '../constants';

@Module({
  imports: [ParkingLotStageModule],
  providers: [
    {
      provide: Service.REPORT,
      useClass: ReportService,
    },
  ],
  controllers: [ReportController],
})
export class ReportModule {}
