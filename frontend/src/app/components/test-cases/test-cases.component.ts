import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ProjectContextService } from '../../services/project-context.service';
import { TestCasesService } from '../../services/test-cases.service';
import { TestCase } from '../../interfaces/test-case';

@Component({
  selector: 'app-test-cases',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './test-cases.component.html',
  styleUrl: './test-cases.component.css'
})
export class TestCasesComponent {
  projectId: any | null = null;
  testcases: TestCase[] = [];

  constructor(
    private projectCtx: ProjectContextService,
    private testcasesSvc: TestCasesService,
    private router: Router
  ){ }

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.loadTestCases(id);
    }
  }

  loadTestCases(projectId: number): void {
    this.testcasesSvc.getTestCasesByProject(projectId).subscribe({
      next: (testcases) => {
        this.testcases = testcases;
      },
      error: (err) => console.error('Failed to load test cases', err)
    });
  }
  
  addTestCase() {
    this.router.navigate([`/projects/${this.projectId}/testcases/new`]);
  }

  viewTestCase(id: number) {
    this.router.navigate([`/projects/${this.projectId}/testcases/${id}`]);
  }

  updateTestCase(id: number) {
    this.router.navigate([`/projects/${this.projectId}/testcases/${id}/edit`]);
  }

  deleteTestCase(id: number): void {
    this.testcasesSvc.deleteTestCase(id).subscribe({
      next: () => {
        this.testcases = this.testcases.filter(testcase => testcase.id !== id);
      },
      error: (err) => console.error('Failed to delete test case', err)
    });
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }  
}
