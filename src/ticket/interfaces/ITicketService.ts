import { Observable } from 'rxjs';

export interface ITicketService {
  createTicket(
    licencePlate: string,
    carSize: 's' | 'm' | 'l',
  ): Observable<{ ticketId: string; yourSlot: Array<string> }>;

  leaveTicket(ticketId: string): Observable<{ message: string }>;
}
