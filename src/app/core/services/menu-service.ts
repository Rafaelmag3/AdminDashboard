import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Route, Router } from '@angular/router';
import { MenuItem } from '@shared/models/menu.interface';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly router = inject(Router);
  private readonly _menuItems = signal<MenuItem[]>([]);
  public readonly menuItems = computed(() => this._menuItems());
  public readonly _isActiveRoute = signal<boolean>(false);
  public readonly getCurrentIndexRoute = computed(() => this._menuItems().findIndex(item => this.isActive(item.route)));
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  constructor() {
    const routes = this.router.config;
    this._menuItems.set(this.buildMenu(routes));
  }

  /**
   * Method to build the menu structure based on the Angular routes configuration.
   * It recursively processes the routes and their children to create a hierarchical menu structure.
   * @param routes - The array of Angular routes to process.
   * @param parentPath - The accumulated path from parent routes, used to build the full route for each menu item.
   * @returns - An array of Menu structures
   */
  private buildMenu(routes: Route[], parentPath: string = ''): MenuItem[] {
    return routes
      .flatMap(route => {
        const fullPath = route.path ? `${parentPath}/${route.path}`.replace(/\/+/g, '/') : parentPath;
        if (!route.path) {
          return route.children
            ? this.buildMenu(route.children, fullPath)
            : [];
        }
        if (!route.data?.['showInMenu']) {
          return [];
        }
        const item: MenuItem = {
          name: route.data?.['name'] || '',
          route: fullPath,
          icon: route.data?.['icon'] || '',
          isChildren: route.data?.['isChildren'] || false
        };

        if (route.children) {
          const children = this.buildMenu(route.children, fullPath);
          if (children.length) {
            item.subMenu = children;
          }
        }

        return [item];
      });
  }

  public isActive(route: string): boolean {
    return this.currentUrl().startsWith(route);
  }

  public isChildActive(route: string): boolean {
    return this.currentUrl().includes(route);
  }
}
