import { TestBed } from '@angular/core/testing';

import { MealInfoserviceService } from './meal-infoservice.service';

describe('MealInfoserviceService', () => {
  let service: MealInfoserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealInfoserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
