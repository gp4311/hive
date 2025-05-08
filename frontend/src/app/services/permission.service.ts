import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    constructor(private auth: AuthService) { }

    getRole(projectId: number): string | null {
        return this.auth.getRoleForProject(projectId);
    }

    canEdit(projectId: number): boolean {
        const role = this.getRole(projectId);
        return ['admin', 'manager', 'engineer', 'reviewer'].includes(role || '');
    }

    isViewer(projectId: number): boolean {
        return this.getRole(projectId) === 'viewer';
    }

    isAdmin(projectId: number): boolean {
        const role = this.auth.getRoleForProject(projectId);
        return role === 'admin';
    }
}
