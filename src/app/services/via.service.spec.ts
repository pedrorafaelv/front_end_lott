import { TestBed } from '@angular/core/testing';

import { ViaService } from './via.service';

describe('ViaService', () => {
  let service: ViaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
