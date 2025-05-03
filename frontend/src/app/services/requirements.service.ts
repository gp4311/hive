import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Requirement, LinkSubsystemRequest, LinkTestCaseRequest } from '../interfaces/requirement';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequirementsService {
    private apiUrl = 'http://localhost:5000/api/requirements';

    constructor(private http: HttpClient) { }

    getRequirementsByProject(projectId: number): Observable<Requirement[]> {
        return this.http.get<Requirement[]>(`${this.apiUrl}/project/${projectId}`);
    }

    getRequirementById(id: number): Observable<Requirement> {
        return this.http.get<Requirement>(`${this.apiUrl}/${id}`);
    }

    addRequirement(requirement: Requirement): Observable<Requirement> {
        return this.http.post<Requirement>(`${this.apiUrl}/add`, requirement);
    }

    updateRequirement(requirement: Requirement): Observable<Requirement> {
        return this.http.put<Requirement>(`${this.apiUrl}/update`, requirement);
    }

    deleteRequirement(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    linkSubsystem(data: LinkSubsystemRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/link-subsystem`, data);
    }

    unlinkSubsystem(data: LinkSubsystemRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/unlink-subsystem`, data);
    }

    linkTestCase(data: LinkTestCaseRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/link-testcase`, data);
    }

    unlinkTestCase(data: LinkTestCaseRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/unlink-testcase`, data);
    }

    getRequirementCount(projectId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/count/${projectId}`);
    }

    getRequirementCountByStatus(projectId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/status-count/${projectId}`);
    }

    getRequirementCountByPriority(projectId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/priority-count/${projectId}`);
    }
}