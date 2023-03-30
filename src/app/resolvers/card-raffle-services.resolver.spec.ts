import { TestBed } from '@angular/core/testing';

import { CardRaffleServicesResolver } from './card-raffle-services.resolver';

describe('CardRaffleServicesResolver', () => {
  let resolver: CardRaffleServicesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CardRaffleServicesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
