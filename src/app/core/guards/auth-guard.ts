import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserStoreService } from '@core/services/user-store-service';

export const authGuard: CanActivateFn = async () => {
  const userStoreService = inject(UserStoreService);
  await userStoreService.initUser();
  const token = userStoreService.token();
  if (!token) {
    userStoreService.logout();
    return false;
  }

  return true;
};