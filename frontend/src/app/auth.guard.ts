import { Injectable } from '@angular/core';
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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
  
    // Extract projectId from route params
    const projectId = +route.params['id'] || +route.parent?.params['id'];
  
    // If projectId exists, check user's role for the project
    if (projectId) {
      const role = this.auth.getRoleForProject(projectId);
      if (!role) {
        this.router.navigate(['/projects']);
        return false;
      }
    }
  
    return true;
  }  
}
