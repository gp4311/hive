import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { PermissionService } from './services/permission.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
    constructor(
        private permission: PermissionService,
        private auth: AuthService,
        private router: Router
    ) { }

    private getProjectIdFromRoute(route: ActivatedRouteSnapshot): number | null {
        let current: ActivatedRouteSnapshot | null = route;
        while (current) {
            const id = current.params['id'];
            if (id && !isNaN(+id)) return +id;
            current = current.parent;
        }
        return null;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.restoreSession().pipe(
            map(() => {
                if (!this.auth.isLoggedIn()) {
                    this.router.navigate(['/login']);
                    return false;
                }

                const projectId = this.getProjectIdFromRoute(route);
                if (projectId !== null && !this.permission.canEdit(projectId)) {
                    this.router.navigate(['/projects', projectId]);
                    return false;
                }

                return true;
            })
        );
    }
}