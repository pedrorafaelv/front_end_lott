import { TestBed } from '@angular/core/testing';

import { AdminDepositService } from './admin-deposit.service';

describe('AdminDepositServiceTsService', () => {
  let service: AdminDepositService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDepositService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
