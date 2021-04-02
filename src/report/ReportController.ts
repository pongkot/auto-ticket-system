import { Controller, Get } from '@nestjs/common';

@Controller('report')
export class ReportController {
  @Get()
  getHealth(): string {
    return 'OK';
  }
}
