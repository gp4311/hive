import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ProjectContextService } from '../../services/project-context.service';
import { RequirementsService } from '../../services/requirements.service';
import { PermissionService } from '../../services/permission.service';
import { Requirement } from '../../interfaces/requirement';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.css'
})
export class RequirementsComponent {
  projectId: any | null = null;
  requirements: Requirement[] = [];

  constructor(
    private projectCtx: ProjectContextService,
    private requirementsSvc: RequirementsService,
    private router: Router,
    public permission: PermissionService
  ){ }

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.loadRequirements(id);
    }
  }

  loadRequirements(projectId: number): void {
    this.requirementsSvc.getRequirementsByProject(projectId).subscribe({
      next: (requirements) => {
        this.requirements = requirements;
      },
      error: (err) => console.error('Failed to load requirements', err)
    });
  }

  addRequirement() {
    this.router.navigate([`/projects/${this.projectId}/requirements/new`]);
  }

  viewRequirement(id: number) {
    this.router.navigate([`/projects/${this.projectId}/requirements/${id}`]);
  }
}
