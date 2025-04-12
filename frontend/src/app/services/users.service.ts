import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectUser } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class ProjectUserService {
  private apiUrl = 'http://localhost:5000/api/project-users';

  constructor(private http: HttpClient) {}

  getUsersForProject(projectId: number): Observable<ProjectUser[]> {
    return this.http.get<ProjectUser[]>(`${this.apiUrl}/${projectId}`);
  }

  addUserToProject(user_id: number, project_id: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { user_id, project_id, role });
  }

  removeUserFromProject(user_id: number, project_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove`, { user_id, project_id });
  }

  updateUserRole(project_id: number, user_id: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-role`, { project_id, user_id, role });
  }
}
