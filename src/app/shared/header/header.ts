import { Component, inject, input } from '@angular/core';
import { environment } from '@env/environment';
import { Card } from '@shared/card/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { UserStoreService } from '@core/services/user-store-service';
import { ICONS } from '@constants/icons.contants';
import { ProfileOptions } from '@core/models/profile-options.interface';

@Component({
  selector: 'shared-header',
  imports: [Card, MatMenuModule, MatButtonModule],
  templateUrl: './header.html',
})
export class Header {
  private readonly userStoreService = inject(UserStoreService);
  public readonly currentNamePage = input.required<string>();
  public readonly imageUser = environment.PUBLICS_URL.TEST_USER_PHOTO_URL;
  public readonly profileOptions: ProfileOptions[] = [
    {
      name: 'Profile',
      icon: ICONS.USER,
      action: () => { }
    },
    {
      name: 'Settings',
      icon: ICONS.SETTINGS,
      action: () => { }
    },
    {
      name: 'Logout',
      icon: ICONS.LOGOUT,
      action: () => this.userStoreService.logout()
    }
  ];
}
