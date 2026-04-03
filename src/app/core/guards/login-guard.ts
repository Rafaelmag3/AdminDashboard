import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserStoreService } from '@core/services/user-store-service';

export const loginGuard: CanActivateFn = () => {
  const userStoreService = inject(UserStoreService);
  const token = userStoreService.token();
  if (token) {
    userStoreService.logout();
  }

  return true;
};
