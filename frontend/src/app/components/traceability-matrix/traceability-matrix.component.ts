import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ProjectContextService } from '../../services/project-context.service';
import { Requirement, RequirementSubsystemMapping, RequirementTestCaseMapping, TraceabilityRow } from '../../interfaces/requirement';
import { RequirementsService } from '../../services/requirements.service';

@Component({
  selector: 'app-traceability-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule, TableModule],
  templateUrl: './traceability-matrix.component.html',
  styleUrl: './traceability-matrix.component.css'
})
export class TraceabilityMatrixComponent implements OnInit {
  projectId: any | null = null;
  requirements: Requirement[] = [];
  traceabilityMatrix: TraceabilityRow[] = [];
  subsystemLinks: RequirementSubsystemMapping[] = [];
  testCaseLinks: RequirementTestCaseMapping[] = [];
  
  priorityFilterValue: string | null = null;
  priorityOptions = [
    { label: 'low', value: 'low' },
    { label: 'medium', value: 'medium' },
    { label: 'high', value: 'high' }
  ];

  statusFilterValue: string | null = null;
  statusOptions = [
    { label: 'draft', value: 'draft' },
    { label: 'reviewed', value: 'reviewed' },
    { label: 'approved', value: 'approved' },
    { label: 'verified', value: 'verified' }
  ];

  verificationFilterValue: string | null = null;
  verificationOptions = [
    { label: 'test', value: 'test' },
    { label: 'inspection', value: 'inspection' },
    { label: 'analysis', value: 'analysis' },
    { label: 'demo', value: 'demo' }
  ];

  constructor(
    private projectCtx: ProjectContextService,
    private requirementsSvc: RequirementsService
  ) { }

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.loadTraceabilityMatrix(id);
    }
  }

  loadTraceabilityMatrix(projectId: number) {
    this.requirementsSvc.getRequirementsByProject(projectId).subscribe({
      next: (requirements) => {
        this.requirementsSvc.getSubsystemsForRequirements(projectId).subscribe({
          next: (subsystems) => {
            this.requirementsSvc.getTestCasesForRequirements(projectId).subscribe({
              next: (testcases) => {
                this.requirements = requirements;
                this.subsystemLinks = subsystems;
                this.testCaseLinks = testcases;

                this.traceabilityMatrix = this.requirements.map(req => {
                  const linkedSubsystems = this.subsystemLinks
                    .filter(link => link.requirement_id === req.id)
                    .map(link => link.subsystem_name);

                  const linkedTestCases = this.testCaseLinks
                    .filter(link => link.requirement_id === req.id);

                  return {
                    requirement_id: req.requirement_id,
                    title: req.title,
                    priority: req.priority,
                    status: req.status,
                    verification_method: req.verification_method,
                    subsystems: linkedSubsystems.length ? linkedSubsystems.join(', ') : '-',
                    test_case_ids: linkedTestCases.length ? linkedTestCases.map(tc => tc.test_case_id).join(', ') : '-',
                    test_case_statuses: linkedTestCases.length ? linkedTestCases.map(tc => tc.test_case_status).join(', ') : '-'
                  };
                });
              },
              error: err => console.error('Failed to load test case mappings', err)
            });
          },
          error: err => console.error('Failed to load subsystem mappings', err)
        });
      },
      error: err => console.error('Failed to load requirements', err)
    });
  }
}
