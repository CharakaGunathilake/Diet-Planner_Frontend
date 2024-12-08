import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BmicalculatorComponent } from '../../../common/bmicalculator/bmicalculator.component';
import { JwtService } from '../../../model/jwt.service';
import { ChartService } from '../../../model/chart.service';
import { HttpClientModule } from '@angular/common/http';

Chart.register(...registerables);
@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [BmicalculatorComponent, HttpClientModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css',
  providers: [JwtService,ChartService]
})
export class ProgressComponent implements OnInit {
  weightChart?: Chart;
  waterChart?: Chart;
  caloricChart?: Chart;
  mealHourChart?: Chart;
  stressChart?: Chart;
  protected userDetails: any = {};
  protected userDietaryInfo: any = {};
  protected userPlan: any;

  ngOnInit(): void {
    this.initializeUser();
    this.initializeCharts();
  }
  initializeCharts() {
   this.waterChart = new Chart("weightChart", this.chartService.weeklyWeightChart());
   this.stressChart = new Chart("stressChart", this.chartService.weeklyStressChart());
   this.waterChart = new Chart("waterChart", this.chartService.dailyWaterProgressChart());
   this.caloricChart = new Chart("caloricChart", this.chartService.createCaloricChart());
   this.mealHourChart = new Chart("mealHourChart", this.chartService.createMealHourChart()); 
  }

  constructor(
    private jwtService: JwtService,
    private chartService: ChartService
  ) { }


  private initializeUser(): void {
    this.jwtService.getUserData().subscribe((data: any) => {
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
      this.userPlan = data.dietPlan;
    })
  }

  

}