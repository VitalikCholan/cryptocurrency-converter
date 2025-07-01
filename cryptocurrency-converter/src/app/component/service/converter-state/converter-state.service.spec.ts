import { TestBed } from '@angular/core/testing';

import { ConverterStateService } from './converter-state.service';

describe('ConverterStateService', () => {
  let service: ConverterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConverterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
