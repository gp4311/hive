import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { User, ProjectUserRole } from '../interfaces/user';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';

  // Store the user and token
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  private rolesSubject = new BehaviorSubject<{ [projectId: number]: string }>({});
  roles$ = this.rolesSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) { }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      name,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('roles', JSON.stringify(res.user.roles));
        this.tokenSubject.next(res.token);
        this.currentUserSubject.next(res.user); // store current user

        const roleMap: { [projectId: number]: string } = {};
        res.user.roles.forEach((r: ProjectUserRole) => {
          roleMap[r.project_id] = r.role;
        });
        this.rolesSubject.next(roleMap);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getRoleForProject(projectId: number): string | null {
    return this.rolesSubject.getValue()[projectId] || null;
  }

  getAllRoles(): { [projectId: number]: string } {
    return this.rolesSubject.getValue();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  setRoles(roleMap: { [projectId: number]: string }) {
    this.rolesSubject.next(roleMap);
  }

  restoreSession(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap((res) => {
        this.tokenSubject.next(token);
        this.currentUserSubject.next(res.user);

        const roleMap: { [projectId: number]: string } = {};
        res.roles.forEach((r: ProjectUserRole) => {
          roleMap[r.project_id] = r.role;
        });

        localStorage.setItem('roles', JSON.stringify(res.roles));
        this.rolesSubject.next(roleMap);
      }),
      map(() => true),
      catchError(err => {
        this.logout();
        return of(false);
      })
    );
  }
}
