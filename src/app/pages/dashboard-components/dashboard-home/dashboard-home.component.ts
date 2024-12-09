import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Modal } from 'bootstrap';
import { Chart, registerables } from 'chart.js';
import { JwtService } from '../../../model/jwt.service';
import { SpoonacularService } from '../../../model/spoonacular.service';
import { ChartService } from '../../../model/chart.service';
import { HttpClientModule } from '@angular/common/http';
import { MealModalComponent } from '../../../common/meal-modal/meal-modal.component';

Chart.register(...registerables);

interface Meal {
  mealId: number;
  recipeName: string;
  mealName: string;
  mealTime: string;
  imageLink: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, NgIf, NgStyle, NgFor, HttpClientModule, MealModalComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
  providers: [JwtService, SpoonacularService, ChartService]
})
export class DashboardHomeComponent implements OnInit {
  @ViewChild('staticBackdrop') mealModal!: ElementRef;

  protected chart1?: Chart;
  protected chart2?: Chart;
  protected userLogin: any = {};
  protected userDetails: any = {};
  protected userDietaryInfo: any = {};
  protected selectedMeals: Meal[];
  protected currentIndex = 0;
  protected weightPercentage = 1;
  protected caloriePercentage = 1;
  protected waterIntake: number;
  protected isSelecting: boolean;
  protected isStarter: boolean;
  protected completedMeals = 0;

  constructor(
    private jwtService: JwtService,
    private chartService: ChartService,
    private spoonacularService: SpoonacularService
  ) {
    this.waterIntake = Number(localStorage.getItem('waterIntake')) || 0;
    // this.isStarter = JSON.parse(localStorage.getItem('isStarter') || 'false');
    // this.isSelecting = JSON.parse(localStorage.getItem('isSelecting') || 'false');
    
    this.isStarter = true;
    this.selectedMeals = new Array({ mealId: 0, recipeName: '', mealName: '', mealTime: '', imageLink: '' });
     this.isSelecting = true;
  }

  ngOnInit(): void {
    this.initializeUser();
    this.initializeCharts();
    this.getSelectedMeals();
  }

  private initializeCharts(): void {
    this.chart1 = new Chart('progressChart', this.chartService.weeklyCalorieChart());
    this.chart2 = new Chart('waterChart',
      this.chartService.dailyWaterIntakerChart(this.waterIntake, this.userDietaryInfo.waterIntake)
    );
  }

  private openModal(index: number): void {
    if(index = 1)this.spoonacularService.getRecipeById(this.selectedMeals[this.currentIndex].mealId);
    if(index = 2)this.spoonacularService.getRandomRecipe(this.selectedMeals[this.currentIndex].mealName,this.userDietaryInfo);
    new Modal(this.mealModal.nativeElement).show();
  }

  protected completeMeal(): void {
    this.caloriePercentage = (356 / this.userDietaryInfo.dcr) * 100;
    const mealName = this.selectedMeals[this.currentIndex].mealName;
    this.jwtService.setMealCompleted(mealName, this.getTime()).subscribe((data) => {
      if(data){
        alert(`meal ${mealName} is completed!`);
      }
    });
  }

  private getTime(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  protected updateWaterIntake(increment: boolean): void {
    if (this.waterIntake === this.userDietaryInfo.waterIntake) {
      alert('Congratulations!! you have completed today\'s Hydration target.');
      return;
    }
    this.waterIntake = increment ?
      this.waterIntake + 1 :
      Math.max(0, this.waterIntake - 1);
    localStorage.setItem('waterIntake', this.waterIntake.toString());

    if (this.chart2) {
      this.chart2.data = this.chartService.dailyWaterIntakerChart(
        this.waterIntake,
        this.userDietaryInfo.waterIntake
      ).data;
      this.chart2.update();
    }
  }

  private initializeUser(): void {
    this.jwtService.getUserData().subscribe((data: any) => {
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
      this.userLogin = data.login;
      this.openModal(2);
    });
  }

  protected showDetails(key: number): void {
    this.currentIndex = key;
    const meal = this.selectedMeals[key];
    this.isSelecting = true;
    if (meal != null) {
      this.openModal(1);
    }
  }

  handleClick() {
    this.isStarter = false;
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    this.isSelecting = true;
  }
  
  private getSelectedMeals() {
    this.jwtService.getSelectedMeals().subscribe((data) => {
      this.selectedMeals = data;
    });
  }
}


