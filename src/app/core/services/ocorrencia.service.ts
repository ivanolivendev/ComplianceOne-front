import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OcorrenciaRequest, OcorrenciaResponse, StatusOcorrencia } from '../models/compliance.model';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/ocorrencias';

  create(request: OcorrenciaRequest): Observable<OcorrenciaResponse> {
    return this.http.post<OcorrenciaResponse>(this.apiUrl, request);
  }

  getByProtocol(protocol: string): Observable<OcorrenciaResponse> {
    return this.http.get<OcorrenciaResponse>(`${this.apiUrl}/protocolo/${protocol}`);
  }

  list(page = 0, size = 20, sort = 'dataCriacao,desc'): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      params: { page, size, sort }
    });
  }

  getById(id: string): Observable<OcorrenciaResponse> {
    return this.http.get<OcorrenciaResponse>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: StatusOcorrencia, observacao: string): Observable<OcorrenciaResponse> {
    // Usando HttpParams para garantir codificação correta dos caracteres
    let params = new HttpParams().set('status', status);
    if (observacao) {
      params = params.set('observacao', observacao);
    }

    return this.http.patch<OcorrenciaResponse>(`${this.apiUrl}/${id}/status`, null, { params });
  }
}
