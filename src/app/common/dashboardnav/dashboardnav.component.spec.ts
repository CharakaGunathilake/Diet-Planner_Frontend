import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardnavComponent } from './dashboardnav.component';

describe('DashboardnavComponent', () => {
  let component: DashboardnavComponent;
  let fixture: ComponentFixture<DashboardnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardnavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
