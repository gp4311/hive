import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../interfaces/project';

@Injectable({ providedIn: 'root' })
export class ProjectContextService {
  private projectIdSubject = new BehaviorSubject<number | null>(null);
  projectId$ = this.projectIdSubject.asObservable();

  setProjectId(id: number) {
    this.projectIdSubject.next(id);
  }

  getProjectId(): number | null {
    return this.projectIdSubject.getValue();
  }
}