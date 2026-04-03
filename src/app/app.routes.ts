import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';
import { loginGuard } from '@core/guards/login-guard';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [loginGuard],
        loadComponent: () => import('@features/auth/pages/login/login').then(m => m.Login)
    },
    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () => import('@features/home/home').then(m => m.Home),
        children: [
            {
                path: 'dashboard',
                canActivate: [authGuard],
                loadComponent: () => import('@features/dashboard/page/dashboard/dashboard').then(m => m.Dashboard)
            },
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
