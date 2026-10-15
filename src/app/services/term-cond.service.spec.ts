import { TestBed } from '@angular/core/testing';

import { TermsService } from './term-cond.service';

describe('TermConditionsService', () => {
  let service: TermsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
