import { TestBed } from '@angular/core/testing';

import { AdminWithdrawalService } from './admin-withdrawal.service';

describe('AdminWithdrawalService', () => {
  let service: AdminWithdrawalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminWithdrawalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
