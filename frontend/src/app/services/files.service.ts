import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
  private apiUrl = 'http://localhost:5000/api/files';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, projectId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId.toString());

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getFile(link: string): Observable<Blob> {
    const fileName = link.split('/uploads/')[1];
    return this.http.get(`http://localhost:5000/uploads/${fileName}`, {
      responseType: 'blob'
    });
  }

  deleteFile(link: string): Observable<any> {
    const fileName = link.split('/uploads/')[1];
    return this.http.delete(`${this.apiUrl}/${fileName}`);
  }
}