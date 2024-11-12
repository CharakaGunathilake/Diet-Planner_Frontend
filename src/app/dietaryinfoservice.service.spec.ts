import { TestBed } from '@angular/core/testing';

import { DietaryinfoserviceService } from './dietaryinfoservice.service';

describe('DietaryinfoserviceService', () => {
  let service: DietaryinfoserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietaryinfoserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
