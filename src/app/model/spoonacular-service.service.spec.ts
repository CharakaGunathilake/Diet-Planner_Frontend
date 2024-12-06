import { TestBed } from '@angular/core/testing';

import { SpoonacularServiceService } from './spoonacular-service.service';

describe('SpoonacularServiceService', () => {
  let service: SpoonacularServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpoonacularServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
