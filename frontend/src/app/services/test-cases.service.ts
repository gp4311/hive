import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestCase } from '../interfaces/test-case';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TestCasesService {
    private apiUrl = 'http://localhost:5000/api/test-cases';

    constructor(private http: HttpClient) { }

    getTestCasesByProject(projectId: number): Observable<TestCase[]> {
        return this.http.get<TestCase[]>(`${this.apiUrl}/project/${projectId}`);
    }

    getTestCaseById(id: number): Observable<TestCase> {
        return this.http.get<TestCase>(`${this.apiUrl}/${id}`);
    }

    addTestCase(testCase: TestCase): Observable<TestCase> {
        return this.http.post<TestCase>(`${this.apiUrl}/add`, testCase);
    }

    updateTestCase(testCase: TestCase): Observable<TestCase> {
        return this.http.put<TestCase>(`${this.apiUrl}/update`, testCase);
    }

    deleteTestCase(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getTestCaseCount(projectId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/count/${projectId}`);
    }

    getTestCaseCountByStatus(projectId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/status-count/${projectId}`);
    }

    getTestCasePassPercentage(projectId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/pass-percentage/${projectId}`);
    }
}