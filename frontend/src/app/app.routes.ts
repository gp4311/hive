import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { PermissionGuard } from './permission.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectLayoutComponent } from './components/project-layout/project-layout.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/new', component: ProjectFormComponent, canActivate: [AuthGuard] },
    { path: 'projects/:id/edit', component: ProjectFormComponent, canActivate: [AuthGuard, PermissionGuard] },
    {
        path: 'projects/:id',
        component: ProjectLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./components/project/project.component').then(m => m.ProjectComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'subsystems',
                loadComponent: () => import('./components/subsystems/subsystems.component').then(m => m.SubsystemsComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'testcases',
                loadComponent: () => import('./components/test-cases/test-cases.component').then(m => m.TestCasesComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'testcases/new',
                loadComponent: () => import('./components/test-case-form/test-case-form.component').then(m => m.TestCaseFormComponent),
                canActivate: [AuthGuard, PermissionGuard]
            },
            {
                path: 'testcases/:testcaseId',
                loadComponent: () => import('./components/test-case-form/test-case-form.component').then(m => m.TestCaseFormComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'requirements',
                loadComponent: () => import('./components/requirements/requirements.component').then(m => m.RequirementsComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'requirements/new',
                loadComponent: () => import('./components/requirement-form/requirement-form.component').then(m => m.RequirementFormComponent),
                canActivate: [AuthGuard, PermissionGuard]
            },
            {
                path: 'requirements/:requirementId',
                loadComponent: () => import('./components/requirement-form/requirement-form.component').then(m => m.RequirementFormComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'traceability-matrix',
                loadComponent: () => import('./components/traceability-matrix/traceability-matrix.component').then(m => m.TraceabilityMatrixComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'users',
                loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
                canActivate: [AuthGuard]
            }
        ]
    },
    { path: '**', redirectTo: 'login' },
];
