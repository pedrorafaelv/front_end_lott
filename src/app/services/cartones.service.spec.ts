import { TestBed } from '@angular/core/testing';

import { CartonesService } from './cartones.service';

describe('CartonesService', () => {
  let service: CartonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
