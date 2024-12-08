import { TestBed } from '@angular/core/testing';

import { DietaryinfoService } from './dietaryinfo.service';

describe('DietaryinfoService', () => {
  let service: DietaryinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietaryinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
