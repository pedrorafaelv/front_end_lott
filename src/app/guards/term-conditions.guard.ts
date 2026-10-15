import { CanActivateFn } from '@angular/router';

export const termConditionsGuard: CanActivateFn = (route, state) => {
  return true;
};
