import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';
import { loginGuard } from '@core/guards/login-guard';
import { ICONS } from './constants/icons.contants';
import { PATH_CONSTANTS } from '@constants/path.constants';

export const routes: Routes = [
    {
        path: PATH_CONSTANTS.ROOT,
        redirectTo: PATH_CONSTANTS.DASHBOARD,
        pathMatch: PATH_CONSTANTS.FULL
    },
    {
        path: PATH_CONSTANTS.LOGIN,
        canActivate: [loginGuard],
        loadComponent: () => import('@features/auth/pages/login/login').then(m => m.Login)
    },
    {
        path: PATH_CONSTANTS.ROOT,
        data: { name: '', showInMenu: true },
        canActivate: [authGuard],
        loadComponent: () => import('@shared/layout/layout').then(m => m.Layout),
        children: [
            {
                path: PATH_CONSTANTS.DASHBOARD,
                canActivate: [authGuard],
                data: { name: 'Dashboard', showInMenu: true, icon: ICONS.DASHBOARD },
                loadComponent: () => import('@features/dashboard/page/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: PATH_CONSTANTS.CUSTOMERS,
                data: { name: 'Customers', showInMenu: true, icon: ICONS.CUSTOMERS },
                children: [
                    {
                        path: PATH_CONSTANTS.ROOT,
                        canActivate: [authGuard],
                        data: { name: 'Customers', showInMenu: true, icon: ICONS.CUSTOMERS },
                        loadComponent: () => import('@features/customers/page/customers').then(m => m.Customers),
                    },
                    {
                        path: PATH_CONSTANTS.FORM,
                        data: { name: 'New Customer', showInMenu: false },
                        loadComponent: () => import('@features/customers/components/form/form').then(m => m.Form)
                    }
                ]
            },
            {
                path: PATH_CONSTANTS.PRODUCTS,
                data: { name: 'Products', showInMenu: true, icon: ICONS.PRODUCTS },
                children: [
                    {
                        path: PATH_CONSTANTS.ROOT,
                        canActivate: [authGuard],
                        data: { name: 'Products', showInMenu: true, icon: ICONS.PRODUCTS },
                        loadComponent: () => import('@features/products/page/products').then(m => m.Products)
                    }
                ]
            }
        ]
    },
    {
        path: PATH_CONSTANTS.ALL,
        redirectTo: PATH_CONSTANTS.DASHBOARD
    }
];
