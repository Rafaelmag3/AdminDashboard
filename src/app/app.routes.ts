import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';
import { loginGuard } from '@core/guards/login-guard';
import { ICONS } from './constants/icons.contants';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [loginGuard],
        loadComponent: () => import('@features/auth/pages/login/login').then(m => m.Login)
    },
    {
        path: '',
        data: { name: '', showInMenu: true },
        canActivate: [authGuard],
        loadComponent: () => import('@shared/layout/layout').then(m => m.Layout),
        children: [
            {
                path: 'dashboard',
                canActivate: [authGuard],
                data: { name: 'Dashboard', showInMenu: true, icon: ICONS.DASHBOARD },
                loadComponent: () => import('@features/dashboard/page/dashboard/dashboard').then(m => m.Dashboard)
            }
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
