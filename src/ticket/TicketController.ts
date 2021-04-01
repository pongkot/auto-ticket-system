import { Controller, Inject, Post } from '@nestjs/common';
import { Service } from '../constants';
import { ITicketService } from './interfaces/ITicketService';
import { Observable } from 'rxjs';

@Controller('ticket')
export class TicketController {
  constructor(
    @Inject(Service.TICKET)
    private readonly ticketService: ITicketService,
  ) {}

  @Post()
  createTicket(): Observable<any> {
    return this.ticketService.createTicket('abc1234', 'm');
  }
}
