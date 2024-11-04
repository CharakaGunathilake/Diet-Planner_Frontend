import { Component } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { DashboardnavComponent } from '../../common/dashboardnav/dashboardnav.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { RouterOutlet } from '@angular/router';
import { MealsComponent } from './meals/meals.component';
import { ProgressComponent } from './progress/progress.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,DashboardnavComponent,DashboardHomeComponent,RouterOutlet,MealsComponent,ProgressComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
