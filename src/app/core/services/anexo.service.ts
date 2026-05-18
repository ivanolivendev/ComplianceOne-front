import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AnexoResponse, AnexoUploadResponse } from '../models/compliance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {
  private readonly http = inject(HttpClient);
  // Bypass do proxy do Angular que está travado no Railway
  private readonly apiUrl = 'http://localhost:8080/api/v1/ocorrencias';

  upload(ocorrenciaId: string, file: File): Observable<number | AnexoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}/${ocorrenciaId}/anexos`;
    console.log(`AnexoService: Iniciando upload para ${url}`);

    return this.http.post<AnexoUploadResponse>(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          return Math.round(100 * event.loaded / (event.total || 1));
        } else if (event.type === HttpEventType.Response) {
          return event.body as AnexoUploadResponse;
        }
        return 0;
      })
    );
  }

  listByOcorrencia(ocorrenciaId: string): Observable<AnexoResponse[]> {
    // Note: If the backend doesn't have a direct list endpoint, 
    // we assume the occurrence detail already contains them or we fetch them here.
    // Based on user request, we have GET /api/v1/ocorrencias/{id}/anexos (implied)
    return this.http.get<AnexoResponse[]>(`${this.apiUrl}/${ocorrenciaId}/anexos`);
  }

  download(anexoId: string): Observable<Blob> {
    return this.http.get(`http://localhost:8080/api/v1/ocorrencias/anexos/${anexoId}`, {
      responseType: 'blob'
    });
  }

  getPreviewUrl(anexoId: string): string {
    return `http://localhost:8080/api/v1/ocorrencias/anexos/${anexoId}`;
  }
}
