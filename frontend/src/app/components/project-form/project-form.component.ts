import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, Project } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent {
  isEditMode = false;
  projectId: any | null = null;
  project: Project = {
    name: '',
    description: '',
    status: 'active',
    start_date: '',
    end_date: ''
  };
  section: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectSvc: ProjectService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const sectionParam = this.route.snapshot.paramMap.get('section');

    if (idParam && !isNaN(+idParam)) {
      this.isEditMode = true;
      this.projectId = +idParam;
      this.section = sectionParam;
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: number) {
    this.projectSvc.getProjectById(id).subscribe({
      next: (data) => {
        // Convert ISO strings to date-only format
        this.project = {
          ...data,
          start_date: data.start_date?.split('T')[0] ?? '',
          end_date: data.end_date?.split('T')[0] ?? ''
        };
      },
      error: (err) => console.error('Failed to load project', err),
    });
  }

  cancel() {
    this.router.navigate(['/projects']);
  }

  saveProject() {
    if (this.isEditMode && this.projectId) {
      this.projectSvc.updateProject(this.projectId, this.project).subscribe({
        next: () => this.router.navigate(['/projects']),
      });
    } else {
      this.projectSvc.createProject(this.project).subscribe({
        next: () => this.router.navigate(['/projects']),
      });
    }
  }
}
