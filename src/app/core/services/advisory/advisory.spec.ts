import { TestBed } from '@angular/core/testing';

import { Advisory } from './advisory';

describe('Advisory', () => {
  let service: Advisory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Advisory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
