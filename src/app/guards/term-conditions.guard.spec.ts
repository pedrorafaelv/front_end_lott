import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { termConditionsGuard } from './term-conditions.guard';

describe('termConditionsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => termConditionsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
