import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects: any [] = [];
  error = '';

  constructor(private projectSvc: ProjectService, private router: Router) {}

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.projectSvc.getProjects().subscribe({
      next: (data) => {
        this.projects = data.sort((a, b) => {
          // Move archived to the bottom, then sort by start_date descending
          if (a.status === 'archived' && b.status !== 'archived') return 1;
          if (a.status !== 'archived' && b.status === 'archived') return -1;
  
          return new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime();
        });
      },
      error: err => {
        this.error = err.error?.error || 'getProjects() failed';
      }
    });
  }

  addProject() {
    this.router.navigate(['/projects/new']);
  }

  editProject(id: number) {
    this.router.navigate([`/projects/${id}/edit`]);
  }

  viewProject(id: number) {
    this.router.navigate([`/projects/${id}`]);
  }

  deleteProject(id: number) {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    this.projectSvc.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== id);
      },
      error: err => {
        this.error = err.error?.error || 'deleteProjects() failed';
      }
    });
  }
}
