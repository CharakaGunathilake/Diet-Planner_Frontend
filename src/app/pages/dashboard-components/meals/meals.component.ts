import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ChartService } from '../../../model/chart.service';
import { SpoonacularService } from '../../../model/spoonacular.service';
import { JwtService } from '../../../model/jwt.service';
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
  selector: 'app-meals',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf, FormsModule, MealModalComponent],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css',
  providers: [JwtService, SpoonacularService, ChartService]

})
export class MealsComponent implements OnInit {

  @ViewChild('staticBackdrop1') mealModal!: ElementRef;
  public chart?: Chart;
  protected userDetails: any = {};
  protected userDietaryInfo: any = {};
  protected userMealInfo: any = [];
  protected currentIndex = 0;
  protected isSelecting: boolean = false;
  protected selectedMeals: Meal[] = [];
  protected completed: String = "";
  protected completedMeals = 0;
  protected searchQuery = "";
  protected resultSet: any = [];
  protected suggestedMeals: any = [];
  protected passingObj: any;

  constructor(
    private jwtService: JwtService,
    private chartService: ChartService,
    private spoonacularService: SpoonacularService
  ) {
    this.selectedMeals = new Array({ mealId: 0, recipeName: '', mealName: '', mealTime: '', imageLink: '' });
  }

  ngOnInit() {
    this.initializeUser();
    this.getSelectedMeals();
    this.initializeCharts();
  }

  private initializeCharts(): void {
    this.chart = new Chart("nutritionChart", this.chartService.createNutritionChart());
  }

  private openModal(index: number): void {
    if (index = 1) this.spoonacularService.getRecipeById(this.selectedMeals[this.currentIndex].mealId);
    if (index = 2) this.spoonacularService.getRandomRecipe(this.selectedMeals[this.currentIndex].mealName, this.userDietaryInfo);
    new Modal(this.mealModal.nativeElement).show();
  }

  private initializeUser(): void {
    this.jwtService.getUserData().subscribe((data: any) => {
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
      this.passingObj = this.userDietaryInfo;
    });
  }

  protected showDetails(key: number): void {
    this.currentIndex = key;
    const meal = this.selectedMeals[key];
    this.isSelecting = true;
    if (meal) {
      this.openModal(1);
    }
  }

  handleSearch() {
    this.spoonacularService.searchMeal(this.searchQuery).subscribe((data) => {
      this.resultSet = data.results;
    });
  }

  private getSelectedMeals() {
    this.jwtService.getSelectedMeals().subscribe((data) => {
      this.selectedMeals = data;
      this.getSuggestions();
    });
  }

  private getSuggestions() {
    const meal = this.selectedMeals[this.currentIndex];
    console.log("meal", meal);
    this.spoonacularService.getSuggestions(meal.mealName, this.userDietaryInfo).subscribe((data: { results: any; }) => {
      this.suggestedMeals = data.results;
      console.log(this.suggestedMeals);
    });
  }
}
