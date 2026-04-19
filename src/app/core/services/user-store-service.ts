import { inject, Injectable, signal } from '@angular/core';
import { User } from '@core/models/user-interface';
import { SessionStorageService } from './session-storage-service';
import { environment } from '@env/environment';
import { NavigationService } from './navigation-service';
import { PATH_CONSTANTS } from '@constants/path.constants';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private readonly sesionStorageService = inject(SessionStorageService);
  private readonly navigationService = inject(NavigationService);
  readonly user = signal<User | null>(null);
  readonly token = signal<string | null>(null);

  async initUser() {
    const key = await this.sesionStorageService.get<string>(environment.SESSION_KEY);
    if (!key) {
      this.user.set(null);
      this.token.set(null);
      return;
    }
    const userData = await this.sesionStorageService.get<User | null>(key);
    const token = await this.sesionStorageService.get<string | null>(`${key}${environment.TOKEN_KEY}`);
    this.user.set(userData);
    this.token.set(token);
  }

  logout() {
    this.user.set(null);
    this.token.set(null);
    this.sesionStorageService.clean();
    this.navigationService.navigateTo(PATH_CONSTANTS.LOGIN);
  }

}
