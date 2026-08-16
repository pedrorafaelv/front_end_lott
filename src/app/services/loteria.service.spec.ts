import { TestBed } from '@angular/core/testing';

import { LoteriaService } from './loteria.service';

describe('LoteriaService', () => {
  let service: LoteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
