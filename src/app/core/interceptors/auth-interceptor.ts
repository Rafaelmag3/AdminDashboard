import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserStoreService } from '@core/services/user-store-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UserStoreService).token();
  if (!token) {
    return next(req);
  }
  const authReq = req.clone({
    setHeaders: {
      Authorization: token,
    },
  });
  return next(authReq);
};
