import { NgFor, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Modal } from 'bootstrap';
import { Chart, registerables } from 'chart.js';
import { JwtServiceService } from '../../../model/jwt-service.service';
import { SpoonacularServiceService } from '../../../model/spoonacular-service.service';
import { ChartServiceService } from '../../../model/chart-service.service';
import { HttpClientModule } from '@angular/common/http';

Chart.register(...registerables);

interface Meal {
  mealId: number;
  recipeName: string;
  mealName: string;
  mealTime: string;
  imageLink: string;
}

interface DietaryInfo {
  mealPlan: number;
  waterIntake: number;
  dcr: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, NgIf, NgStyle, NgFor, HttpClientModule,],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
  providers: [JwtServiceService, SpoonacularServiceService, ChartServiceService]
})
export class DashboardHomeComponent implements OnInit {
  @ViewChild('staticBackdrop') private mealModal!: ElementRef;

  protected chart1?: Chart;
  protected chart2?: Chart;
  protected userDetails: any;
  protected userDietaryInfo: any = {};
  protected meals: string[] = [];
  protected mealTimes: string[] = [];
  protected currentIndex = 0;
  protected title = '';
  protected isSelecting = false;
  protected btnText = 'Choose This';
  protected selectedMeals: Meal[] = [];
  protected weightPercentage = 1;
  protected caloriePercentage = 1;
  protected waterIntake: number;
  protected isStarter: boolean;
  protected completedMeals = 0;
  protected userLogin: any = {};
  protected recipe: any;
  bool = false;
  userPlan: any = {};

  constructor(
    private jwtService: JwtServiceService,
    private chartService: ChartServiceService,
    private spoonacularService: SpoonacularServiceService
  ) {
    this.waterIntake = Number(localStorage.getItem('waterIntake')) || 0;
    this.isStarter = JSON.parse(localStorage.getItem('isStarter') || 'false');
  }

  ngOnInit(): void {
    this.initializeCharts();
    this.initializeUser();
    this.isStarter = true;
    this.openModal('Dashboard');
  }

  private initializeCharts(): void {
    this.chart1 = new Chart('progressChart', this.chartService.weeklyCalorieChart());
    this.chart2 = new Chart('waterChart',
      this.chartService.dailyWaterIntakerChart(this.waterIntake, this.userDietaryInfo.waterIntake)
    );
  }

  private openModal(title: string): void {
    this.title = title;
    const modal = new Modal(this.mealModal.nativeElement);
    modal.show();
  }

  protected completeMeal(): void {
    this.caloriePercentage = (356 / this.userDietaryInfo.dcr) * 100;
    const selectedMeal = this.selectedMeals[this.currentIndex];
    if (selectedMeal) {
      const meal = this.getThisMeal(selectedMeal.mealId);
      this.jwtService.setMealCompleted(meal.mealId, this.getTime());
    }
  }

  private getTime(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  private getDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
    this.jwtService.getUserData(8).subscribe((data: any) => {
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
      this.setMealTimes(this.userDietaryInfo.mealPlan);
    });
    this.getSelectedMeals();
  }

  protected showDetails(key: number): void {
    this.currentIndex = key;
    const meal = this.selectedMeals[key];
    if (meal) {
      this.getThisMeal(meal.mealId);
      this.openModal(`${meal.mealName} Details`);
    }
  }

  setMealTimes(mealPlan: number) {
    switch (mealPlan) {
      case 3:
        this.meals = ["Breakfast", "Lunch", "Dinner"];
        this.mealTimes = ["9:00 AM", "Between 12:00 PM and 2:00 PM", "7:00 PM"];
        break;
      case 2:
        this.meals = ["Meal 1", "Meal 2"];
        this.mealTimes = ["Between 10:00 AM and 12:00 PM", "Between 12:00 PM and 6:00 PM"];
        break;
      case 4:
        this.meals = ["Breakfast", "Lunch", "Snack", "Dinner"];
        this.mealTimes = ["Between 8:00 AM and 10:00 AM", "Between 11:00 AM and 1:00 PM", "Between 3:00 PM and 5:00 PM", "7:00 PM"];
        break;
      case 5:
        this.meals = ["Breakfast", "Second Breakfast", "Lunch", "Afternoon Snack", "Dinner"];
        this.mealTimes = ["Between 6:00 AM and 8:00 AM", "Between 8:00 AM and 11:00 AM", "Between 11:00 AM and 1:00 PM", "Between 3:00 PM and 5:00 PM", "7:00 PM"];
        break;
    }
  }

  handleClick() {
    this.isStarter = false;
    this.btnText = "Next"
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    this.getRandomMeal(this.meals[this.currentIndex]);
    this.title = `Choose your ${this.meals[this.currentIndex]}`;
  }

  // protected setMealRecipe() {
  //   this.title = `Choose your ${this.meals[this.currentIndex]}`;
  //   this.selectedMeals.push({
  //     mealId: this.recipe.id,
  //     recipeName: this.recipe.title,
  //     mealName: this.meals[this.currentIndex],
  //     mealTime: this.mealTimes[this.currentIndex],
  //     imageLink: this.recipe.image
  //   });
  //   if (this.currentIndex != this.meals.length - 1) {
  //     this.getRandomMeal(this.meals[this.currentIndex++]);
  //     console.log(this.selectedMeals);
  //   } else {
  //     this.btnText = "Done!";
  //     localStorage.setItem("isSelecting", JSON.stringify(this.isSelecting = false))
  //     this.jwtService.addMealsForDay(this.selectedMeals);
  //     this.selectedMeals = [];
  //     this.getSelectedMeals();
  //   }
  // }

  getMealIngredients(ingredients: any) {
    return getSplittedString(1, ingredients);
  }

  getRecipeCuisines(cuisines: any) {
    return getSplittedString(2, cuisines);
  }

  // brings meals from the database
  private getSelectedMeals() {
    this.jwtService.getSelectedMeals(5, "2024-11-22").subscribe((data) => {
      this.selectedMeals = data;
    });
  }

  // gets infomation from spoonacular about the meal selected by the user
  getThisMeal(mealId: number): any {
    this.recipe = this.spoonacularService.getRecipeById(mealId);
  }

  // gets a random meal from source
  protected getRandomMeal(mealName: string) {
    this.recipe = this.spoonacularService.getRandomRecipe(mealName, this.userDetails.dietaryInfo);
  }
}

function getSplittedString(index: number, array: any[]): string {
  if (!array || array.length === 0) {
    return index === 2 ? 'Common' : '';
  }

  switch (index) {
    case 1:
      return array.map(obj => {
        const name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);
        return `${obj.amount} ${obj.unit} ${name}`;
      }).join(', ');
    case 2:
      return array.join(', ');
    default:
      return 'none';
  }
}

// function getSplittedString(index: number, array: any): string {
//   let names = "";
//   switch (index) {
//     case 1: {
//       array.forEach((obj: any) => {
//         obj.name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);
//         names += obj.amount + " " + obj.unit + " " + obj.name + ", ";
//       })
//       return names = names.substring(0, names.length - 2);
//     }
//     case 2: {
//       if (array.length == 0) {
//         return "Common"
//       } else {
//         array.forEach((obj: any) => {
//           names += obj + ", ";
//         })
//         return names = names.substring(0, names.length - 2);
//       }
//     } default: {
//       return "none";
//     }
//   }
// }

