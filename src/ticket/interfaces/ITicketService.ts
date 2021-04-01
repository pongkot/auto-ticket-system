import { Observable } from 'rxjs';

export interface ITicketService {
  // TODO
  createTicket(licencePlate: string, carSize: 's' | 'm' | 'l'): Observable<any>;
}
