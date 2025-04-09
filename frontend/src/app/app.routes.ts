import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectComponent } from './components/project/project.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/new', component: ProjectFormComponent, canActivate: [AuthGuard] },
    { path: 'projects/:id/edit', component: ProjectFormComponent, canActivate: [AuthGuard] },
    { path: 'projects/:id', component: ProjectComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' },
];
