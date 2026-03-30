import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserStoreService } from '@core/services/user-store-service';
import { NavigationService } from '@core/services/navigation-service';

export const authGuard: CanActivateFn = async () => {
  const userStoreService = inject(UserStoreService);
  const navigationService = inject(NavigationService);
  await userStoreService.initUser();
  const token = userStoreService.token();
  if (!token) {
    userStoreService.logout();
    navigationService.navigateTo('login');
    return false;
  }

  return true;
};