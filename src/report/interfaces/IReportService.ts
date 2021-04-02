import { Observable } from 'rxjs';

export interface IReportService {
  // TODO
  getLicencePlateByCarSize(size: 's' | 'm' | 'l'): Observable<any>;
}
