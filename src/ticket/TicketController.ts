import { Body, Controller, Inject, Param, Post, Put } from '@nestjs/common';
import { Service } from '../constants';
import { ITicketService } from './interfaces/ITicketService';
import { Observable } from 'rxjs';
import { CreateTicketDto } from './dto/CreateTicketDto';

@Controller('ticket')
export class TicketController {
  constructor(
    @Inject(Service.TICKET)
    private readonly ticketService: ITicketService,
  ) {}

  @Post()
  createTicket(@Body() body: CreateTicketDto): Observable<any> {
    return this.ticketService.createTicket(body.licencePlate, body.carSize);
  }

  @Put('leave/:ticketId')
  leaveTicket(@Param('ticketId') id: string): Observable<{ message: string }> {
    return this.ticketService.leaveTicket(id);
  }
}
