import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MenuItem } from '@shared/models/menu.interface';
import { ICONS } from 'src/app/constants/icons.contants';
import { MenuService } from '@core/services/menu-service';
import { NavigationService } from '@core/services/navigation-service';
import { environment } from '@env/environment';

@Component({
  selector: 'shared-menu',
  imports: [MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  private readonly menuService = inject(MenuService);
  private readonly navigationService = inject(NavigationService);
  public readonly drawer = viewChild.required<MatDrawer>('drawer');
  private readonly _isOpenSlideMenu = signal<boolean>(true);
  public readonly isOpenSlideMenu = computed(() => this._isOpenSlideMenu());
  private readonly _openSubMenuIndex = signal<number | null>(null);
  public readonly openSubMenuIndex = computed(() => this._openSubMenuIndex());
  public readonly ICONS = ICONS;
  public readonly menuItems = computed<MenuItem[]>(() => this.menuService.menuItems());
  public readonly iconApp = environment.ICON_APP_URL;

  ngOnInit() {
    this._openSubMenuIndex.set(this.menuService.getCurrentIndexRoute());
  }

  toggleMenu() {
    this.drawer().toggle();
    this._isOpenSlideMenu.update((isOpen) => !isOpen);
  }

  /**
   * Method to toggle the submenu of a menu item
   * If the menu item has a submenu, it will toggle the submenu
   * @param index 
   * @param item 
   */
  toggleSubMenu(index: number, item: MenuItem): void {
    this.navigationService.navigateTo(item.route);
    if (!item.subMenu) {
      this._openSubMenuIndex.set(null);
      return;
    };
    this._openSubMenuIndex.update(current =>
      current === index ? null : index
    );
  }

  navigateTo(item: MenuItem): void {
    this.navigationService.navigateTo(item.route);
  }

  navigateChild(subItem: MenuItem): void {
    this.navigationService.navigateTo(subItem.route);
  }

  isActive(route: string): boolean {
    return this.menuService.isActive(route);
  }

  isChildActive(route: string): boolean {
    return this.menuService.isChildActive(route);
  }
}
