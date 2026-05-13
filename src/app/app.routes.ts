import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { Role } from './core/models/compliance.model';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./features/public/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'denunciar',
    loadComponent: () => import('./features/public/report-wizard.component').then(m => m.ReportWizardComponent)
  },
  {
    path: 'sucesso',
    loadComponent: () => import('./features/public/success.component').then(m => m.SuccessComponent)
  },
  {
    path: 'protocolo',
    loadComponent: () => import('./features/public/protocol-view.component').then(m => m.ProtocolViewComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/admin/login.component').then(m => m.LoginComponent)
  },

  // Admin Routes (Protected)
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'ocorrencias',
        loadComponent: () => import('./features/admin/occurrence-list.component').then(m => m.OccurrenceListComponent)
      },
      {
        path: 'ocorrencias/:id',
        loadComponent: () => import('./features/admin/occurrence-detail.component').then(m => m.OccurrenceDetailComponent)
      },
      {
        path: 'usuarios',
        data: { roles: [Role.ADMIN, Role.DIRETORIA] },
        loadComponent: () => import('./features/admin/user-management.component').then(m => m.UserManagementComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
