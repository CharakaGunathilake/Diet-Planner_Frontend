import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealModalComponent } from './meal-modal.component';

describe('MealModalComponent', () => {
  let component: MealModalComponent;
  let fixture: ComponentFixture<MealModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
