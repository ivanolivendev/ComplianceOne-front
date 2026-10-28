import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnexoResponse } from '../models/compliance.model';

@Injectable({ providedIn: 'root' })
export class AnexoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/ocorrencias`;

  upload(ocorrenciaId: string, file: File): Observable<AnexoResponse> {
    const data = new FormData();
    data.append('file', file, file.name);
    return this.http.post<AnexoResponse>(`${this.apiUrl}/${ocorrenciaId}/anexos`, data);
  }

  listByOcorrencia(ocorrenciaId: string): Observable<AnexoResponse[]> {
    return this.http.get<AnexoResponse[]>(`${this.apiUrl}/${ocorrenciaId}/anexos`);
  }

  getPreviewUrl(anexoId: string): string {
    return `${environment.apiUrl}/anexos/${anexoId}/conteudo`;
  }

  download(anexoId: string): Observable<Blob> {
    return this.http.get(this.getPreviewUrl(anexoId), { responseType: 'blob' });
  }
}
