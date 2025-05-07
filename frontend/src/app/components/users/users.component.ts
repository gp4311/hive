import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../services/auth.service';
import { ProjectUserService } from '../../services/users.service';
import { ProjectContextService } from '../../services/project-context.service';
import { User, UserWithRole } from '../../interfaces/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  projectId: any | null = null;
  projectUsers: UserWithRole[] = [];
  allUsers: User[] = [];
  availableUsers: User[] = [];
  selectedUserId: any | null = null;
  selectedUserRole: any | null = null;

  constructor(
    private authSvc: AuthService,
    private userSvc: ProjectUserService,
    private projectCtx: ProjectContextService
  ) {}

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.loadProjectUsers(id);
      this.loadAllUsers();
    }
  }

  loadProjectUsers(id: number) {
    this.userSvc.getUsersForProject(id).subscribe({
      next: (users) => {
        this.projectUsers = users;
        this.computeAvailableUsers();
      },
      error: (err) => console.error('Failed to load project users', err),
    });
  }
  
  loadAllUsers() {
    this.authSvc.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.computeAvailableUsers();
      },
      error: (err) => console.error('Failed to load all users', err),
    });
  }

  computeAvailableUsers() {
    if (!this.projectUsers || !this.allUsers) return;
  
    const projectUserIds = new Set(this.projectUsers.map(u => u.id));
    this.availableUsers = this.allUsers.filter(u => !projectUserIds.has(u.id));
  }

  addUser() {
    if(this.selectedUserId && this.selectedUserRole) {
      this.userSvc.addUserToProject(this.selectedUserId, this.projectId!, this.selectedUserRole).subscribe({
        next: () => {
          this.loadProjectUsers(this.projectId!);
          this.selectedUserId = null;
          this.selectedUserRole = null;
        }
      });
    }
  }
  
  removeUser(userId: number) {
    this.userSvc.removeUserFromProject(userId, this.projectId!).subscribe({
      next: () => {
        this.loadProjectUsers(this.projectId!);
      }
    });
  }

  updateUserRole(user: UserWithRole) {
    this.userSvc.updateUserRole(this.projectId!, user.id, user.role).subscribe({
      next: () => {}
    });
  }
}
