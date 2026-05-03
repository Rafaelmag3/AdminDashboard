import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '@core/models/user-interface';
import { SessionStorageService } from '@core/services/session-storage-service';
import { environment } from '@env/environment';
import { NavigationService } from '@core/services/navigation-service';
import { PATH_CONSTANTS } from '@constants/path.constants';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private readonly sesionStorageService = inject(SessionStorageService);
  private readonly navigationService = inject(NavigationService);
  readonly user = signal<User | null>(null);
  readonly token = signal<string | null>(null);
  readonly getIsAdmin = computed(() => this.user()?.role.name === 'ADMIN');

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
