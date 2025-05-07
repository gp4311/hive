import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';

import { AuthService } from '../../services/auth.service';
import { ProjectUserService } from '../../services/users.service';

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
    private projectSvc: ProjectService,
    private userSvc: ProjectUserService,
    private auth: AuthService
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
    if (this.isEditMode && this.projectId) {
      this.router.navigate([`/projects/${this.projectId}`]);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  saveProject() {
    const userId = this.auth.getCurrentUser()?.id;
    if (!userId) {
      console.error('User not logged in.');
      return;
    }

    if (this.isEditMode && this.projectId) {
      this.projectSvc.updateProject(this.projectId, this.project).subscribe({
        next: () => this.router.navigate([`/projects/${this.projectId}`]),
      });
    } else {
      this.projectSvc.createProject(this.project).subscribe({
        next: (createdProject) => {
          if (!createdProject.id) return;
      
          this.assignUserAsAdminToProject(userId, createdProject);
          this.router.navigate(['/projects']);
        },
        error: (err) => console.error('Failed to create project:', err)
      });
    }
  }

  assignUserAsAdminToProject(userId: number, project: Project): void {
    this.userSvc.addUserToProject(userId, project.id!, 'admin').subscribe({
      next: () => {
        // Read roles from localStorage
        const storedRoles = localStorage.getItem('roles');
        const roles = storedRoles ? JSON.parse(storedRoles) : [];
  
        // Add the new admin role
        roles.push({
          project_id: project.id,
          project_name: project.name,
          role: 'admin'
        });
  
        // Save updated roles to localStorage
        localStorage.setItem('roles', JSON.stringify(roles));
  
        // Update AuthService's rolesSubject
        const roleMap: { [projectId: number]: string } = {};
        roles.forEach((r: any) => {
          roleMap[r.project_id] = r.role;
        });
        this.auth.setRoles(roleMap);
      },
      error: (err) => console.error('Failed to assign user to project:', err)
    });
  }  
}
