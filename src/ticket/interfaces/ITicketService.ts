import { Observable } from 'rxjs';

export interface ITicketService {
  createTicket(
    licencePlate: string,
    carSize: 's' | 'm' | 'l',
  ): Observable<{ ticketId: string }>;
}
