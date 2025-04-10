import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Input() projectId!: number;
  @Input() isEditMode!: boolean;
  
  projectName: string = 'Untitled';

  constructor(private projectSvc: ProjectService) {}

  ngOnInit(): void {
    if (this.projectId) {
      this.projectSvc.getProjectById(this.projectId).subscribe({
        next: (project: Project) => {
          this.projectName = project.name;
        },
        error: (err) => {
          console.error('Failed to load project name:', err);
        }
      });
    }
  }
}
