import { Component, computed, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MenuItem } from '@shared/models/menu.interface';
import { ICONS } from '@constants/icons.contants';
import { MenuService } from '@core/services/menu-service';
import { NavigationService } from '@core/services/navigation-service';
import { environment } from '@env/environment';
import { Header } from '@shared/header/header';
import { DeviceTypeService } from '@core/services/device-type-service';
import { MENU_CONSTANTS } from '@constants/menu.constants';

@Component({
  selector: 'shared-menu',
  imports: [MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule, Header],
  templateUrl: './menu.html',
})
export class Menu implements OnInit {
  private readonly menuService = inject(MenuService);
  private readonly navigationService = inject(NavigationService);
  private readonly deviceTypeService = inject(DeviceTypeService);
  public readonly drawer = viewChild.required<MatDrawer>('drawer');
  public readonly containerDrawer = viewChild.required<MatDrawer>('containerDrawer');
  private readonly _isOpenSlideMenu = signal<boolean>(true);
  private readonly _openSubMenuIndex = signal<number | null>(null);
  private readonly _hasBackdrop = signal<boolean | null>(false);
  public readonly isOpenSlideMenu = computed(() => this._isOpenSlideMenu());
  public readonly openSubMenuIndex = computed(() => this._openSubMenuIndex());
  public readonly currentNameRoute = computed(() => this.menuService.getCurrentNameRoute());
  public readonly typeDevice = computed(() => this.deviceTypeService.device());
  public readonly hasBackdrop = computed(() => this._hasBackdrop());
  public readonly ICONS = ICONS;
  public readonly menuItems = computed<MenuItem[]>(() => this.menuService.menuItems());
  public readonly iconApp = environment.PUBLICS_URL.ICON_APP_URL;
  public readonly titleApp = environment.appName;

  constructor() {
    effect(() => {
      if (this.typeDevice() === MENU_CONSTANTS.MOBILE) {
        this._isOpenSlideMenu.set(false);
        this._hasBackdrop.set(true);
        return;
      }
      this._hasBackdrop.set(false);
      this._isOpenSlideMenu.set(true);
    });
  }

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
