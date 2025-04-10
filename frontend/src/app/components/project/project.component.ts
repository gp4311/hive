import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
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
      this.projectId = +idParam;
      this.section = sectionParam;
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: number) {
    this.projectSvc.getProjectById(id).subscribe({
      next: (data) => {
        this.project = {
          ...data,
          start_date: data.start_date?.split('T')[0] ?? '',
          end_date: data.end_date?.split('T')[0] ?? ''
        };
      },
      error: (err) => console.error('Failed to load project', err),
    });
  }

  editProject(id: number) {
    this.router.navigate([`/projects/${id}/edit`]);
  }
}
