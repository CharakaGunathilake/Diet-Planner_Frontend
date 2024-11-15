import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyemailComponent } from './verifyemail.component';

describe('VerifyemailComponent', () => {
  let component: VerifyemailComponent;
  let fixture: ComponentFixture<VerifyemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyemailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
