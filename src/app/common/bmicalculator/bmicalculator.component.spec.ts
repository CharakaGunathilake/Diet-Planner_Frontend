import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmicalculatorComponent } from './bmicalculator.component';

describe('BmicalculatorComponent', () => {
  let component: BmicalculatorComponent;
  let fixture: ComponentFixture<BmicalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmicalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BmicalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
