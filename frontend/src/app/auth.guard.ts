import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.restoreSession().pipe(
      map(() => {
        if (!this.auth.isLoggedIn()) {
          this.router.navigate(['/login']);
          return false;
        }
  
        const projectId = this.getProjectIdFromRoute(route);
        if (projectId !== null) {
          const role = this.auth.getRoleForProject(projectId);
          if (!role) {
            this.router.navigate(['/projects']);
            return false;
          }
        }
  
        return true;
      })
    );
  }  

  private getProjectIdFromRoute(route: ActivatedRouteSnapshot): number | null {
    let current: ActivatedRouteSnapshot | null = route;
    while (current) {
      const id = current.params['id'];
      if (id && !isNaN(+id)) return +id;
      current = current.parent;
    }
    return null;
  }  
}
