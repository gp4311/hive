import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';

  // Store the user and token
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      name,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password,
    }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.tokenSubject.next(res.token);
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
}
