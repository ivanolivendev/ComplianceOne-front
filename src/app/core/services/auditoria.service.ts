import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditoriaResponse } from '../models/compliance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/ocorrencias';

  getHistory(ocorrenciaId: string): Observable<AuditoriaResponse[]> {
    return this.http.get<AuditoriaResponse[]>(`${this.apiUrl}/${ocorrenciaId}/historico`);
  }
}
