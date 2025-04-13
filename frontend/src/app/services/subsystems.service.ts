import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subsystem } from '../interfaces/subsystem';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubsystemService {
  private apiUrl = 'http://localhost:5000/api/subsystems';

  constructor(private http: HttpClient) {}

  getSubsystemsByProject(projectId: number): Observable<Subsystem[]> {
    return this.http.get<Subsystem[]>(`${this.apiUrl}/${projectId}`);
  }

  addSubsystem(subsystem: Subsystem): Observable<Subsystem> {
    return this.http.post<Subsystem>(`${this.apiUrl}/add`, subsystem);
  }

  updateSubsystem(subsystem: Subsystem): Observable<Subsystem> {
    return this.http.put<Subsystem>(`${this.apiUrl}/update`, subsystem);
  }

  deleteSubsystem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}