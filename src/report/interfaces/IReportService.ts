import { Observable } from 'rxjs';

export interface IReportService {
  getLicencePlateByCarSize(size: 's' | 'm' | 'l'): Observable<Array<string>>;
}
