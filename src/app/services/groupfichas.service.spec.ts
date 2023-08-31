import { TestBed } from '@angular/core/testing';

import { GroupfichasService } from './groupfichas.service';

describe('GroupfichasService', () => {
  let service: GroupfichasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupfichasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
