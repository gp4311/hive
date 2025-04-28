import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectContextService } from '../../services/project-context.service';
import { RequirementsService } from '../../services/requirements.service';
import { SubsystemService } from '../../services/subsystems.service';
import { TestCasesService } from '../../services/test-cases.service';
import { Requirement, LinkSubsystemRequest, LinkTestCaseRequest } from '../../interfaces/requirement';

@Component({
  selector: 'app-requirement-form',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, ReactiveFormsModule],
  templateUrl: './requirement-form.component.html',
  styleUrl: './requirement-form.component.css'
})
export class RequirementFormComponent implements OnInit {
  projectId: any | null = null;
  requirementId: any | null = null;
  requirement: Requirement = {
    project_id: this.projectId,
    requirement_id: '',
    title: '',
    description: '',
    type: 'functional',
    priority: 'high',
    status: 'draft',
    verification_method: 'test',
    source: '',
    stakeholder: '',
    linkedSubsystems: [],
    linkedTestCases: []
  }

  subsystems: any[] = [];
  testcases: any[] = [];

  selectedSubsystemIds: number[] = [];
  selectedTestCaseIds: number[] = [];

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  constructor(
    private requirementsSvc: RequirementsService,
    private subsystemSvc: SubsystemService,
    private testcasesSvc: TestCasesService,
    private projectCtx: ProjectContextService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.requirement.project_id = id;
    }

    this.loadSubsystems();
    this.loadTestCases();

    const idParam = this.route.snapshot.paramMap.get('requirementId');
    if (idParam && !isNaN(+idParam)) {
      this.requirementId = +idParam;
      this.loadRequirement(this.requirementId);
    }
  }

  loadRequirement(id: number) {
    this.requirementsSvc.getRequirementById(id).subscribe({
      next: (data) => {
        this.requirement = { ...data }
        this.selectedSubsystemIds = this.requirement.linkedSubsystems?.map(s => s.id) ?? [];
        this.selectedTestCaseIds = this.requirement.linkedTestCases?.map(t => t.id) ?? [];        
      },
      error: (err) => console.error('Failed to get requirement:', err)
    });
  }

  loadSubsystems() {
    this.subsystemSvc.getSubsystemsByProject(this.projectId).subscribe({
      next: (data) => {
        this.subsystems = data.map(s => ({
          id: s.id,
          name: s.name,
        }));
      },
      error: (err) => console.error('Failed to load subsystems:', err)
    });
  }

  loadTestCases() {
    this.testcasesSvc.getTestCasesByProject(this.projectId).subscribe({
      next: (data) => {
        this.testcases = data.map(tc => ({
          id: tc.id,
          test_case_id: tc.test_case_id
        }));
      },
      error: (err) => console.error('Failed to load test cases:', err)
    });
  }

  onSubmit(): void {
    this.unlinkSubsystems();
    this.unlinkTestCases();

    if (this.requirementId) {
      this.requirementsSvc.updateRequirement(this.requirement).subscribe({
        next: () => {
          this.linkSelectedSubsystems();
          this.linkSelectedTestCases();
          this.router.navigate([`/projects/${this.projectId}/requirements`]);
        },
        error: (err) => console.error('Failed to update requirement', err)
      });
    } else {
      this.requirementsSvc.addRequirement(this.requirement).subscribe({
        next: (createdRequirement) => {
          // After creating, link subsystems and testcases
          this.requirementId = createdRequirement.id;  // update local id
          this.linkSelectedSubsystems();
          this.linkSelectedTestCases();
          this.router.navigate([`/projects/${this.projectId}/requirements`]);
        },
        error: (err) => console.error('Failed to add requirement', err)
      });
    }
  }

  linkSelectedSubsystems(): void {
    const alreadyLinkedIds = this.requirement.linkedSubsystems?.map(s => s.id) || [];

    const toLink = this.selectedSubsystemIds.filter(id => !alreadyLinkedIds.includes(id));
    for (const subsystemId of toLink) {
      const data: LinkSubsystemRequest = {
        requirementId: this.requirementId,
        subsystemId: subsystemId
      };
      this.requirementsSvc.linkSubsystem(data).subscribe({
        error: (err) => console.error(`Failed to link subsystem ${subsystemId}`, err)
      });
    }
  }

  unlinkSubsystems(): void {
    const alreadyLinkedIds = this.requirement.linkedSubsystems?.map(s => s.id) || [];

    const toUnlink = alreadyLinkedIds.filter(id => !this.selectedSubsystemIds.includes(id));
    for (const subsystemId of toUnlink) {
      const data: LinkSubsystemRequest = {
        requirementId: this.requirementId,
        subsystemId: subsystemId
      };
      this.requirementsSvc.unlinkSubsystem(data).subscribe({
        error: (err) => console.error(`Failed to unlink subsystem ${subsystemId}`, err)
      });
    }
  }

  linkSelectedTestCases(): void {
    const alreadyLinkedIds = this.requirement.linkedTestCases?.map(tc => tc.id) || [];

    const toLink = this.selectedTestCaseIds.filter(id => !alreadyLinkedIds.includes(id));
    for (const testCaseId of toLink) {
      const data: LinkTestCaseRequest = {
        requirementId: this.requirementId,
        testCaseId: testCaseId
      };
      this.requirementsSvc.linkTestCase(data).subscribe({
        error: (err) => console.error(`Failed to link test case ${testCaseId}`, err)
      });
    }
  }

  unlinkTestCases(): void {
    const alreadyLinkedIds = this.requirement.linkedTestCases?.map(tc => tc.id) || [];

    const toUnlink = alreadyLinkedIds.filter(id => !this.selectedTestCaseIds.includes(id));
    for (const testCaseId of toUnlink) {
      const data: LinkTestCaseRequest = {
        requirementId: this.requirementId,
        testCaseId: testCaseId
      };
      this.requirementsSvc.unlinkTestCase(data).subscribe({
        error: (err) => console.error(`Failed to unlink test case ${testCaseId}`, err)
      });
    }
  }

  deleteRequirement(): void {
    for (const subsystemId of this.selectedSubsystemIds) {
      const data: LinkSubsystemRequest = {
        requirementId: this.requirementId,
        subsystemId: subsystemId
      };
      this.requirementsSvc.unlinkSubsystem(data).subscribe({
        error: (err) => console.error(`Failed to unlink subsystem ${subsystemId}`, err)
      });
    }

    for (const testCaseId of this.selectedTestCaseIds) {
      const data: LinkTestCaseRequest = {
        requirementId: this.requirementId,
        testCaseId: testCaseId
      };
      this.requirementsSvc.unlinkTestCase(data).subscribe({
        error: (err) => console.error(`Failed to unlink test case ${testCaseId}`, err)
      });
    }

    this.requirementsSvc.deleteRequirement(this.requirementId).subscribe({
      next: () => this.router.navigate([`/projects/${this.projectId}/requirements`]),
      error: (err) => console.error('Failed to delete requirement', err)
    });
  }

  onCancel(): void {
    this.router.navigate([`/projects/${this.projectId}/requirements`]);
  }
}
