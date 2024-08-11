import { TestBed } from '@angular/core/testing';

import { CoinMarketCapService } from './coin-market-cap.service';

describe('CoinMarketCapService', () => {
  let service: CoinMarketCapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinMarketCapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
