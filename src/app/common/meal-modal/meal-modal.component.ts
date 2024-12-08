import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { SpoonacularService } from '../../model/spoonacular.service';
import { JwtService } from '../../model/jwt.service';

@Component({
  selector: 'app-meal-modal',
  standalone: true,
  imports: [NgIf, HttpClientModule,],
  templateUrl: './meal-modal.component.html',
  styleUrl: './meal-modal.component.css',
  providers: [SpoonacularService]
})
export class MealModalComponent implements OnInit {

  @Input() public dietaryInfo: any = {};
  protected recipe: any = {};
  btnText: string;
  currentIndex: any;
  isSelecting: any;
  meals: string[] = [];
  mealTimes: string[] = [];
  selectedMeals: any = [];
  title: string;
  userDetails: any;
  caloriePercentage: number;

  constructor(
    private jwtService: JwtService,
    private spoonacularService: SpoonacularService
  ) {
    this.setMealTimes(3);
    this.caloriePercentage = 1;
    this.btnText = "Next";
    this.currentIndex = 0;
    this.title = `Choose your ${this.meals[this.currentIndex]}`;
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    this.isSelecting = true;
  }
  ngOnInit(): void {
    this.getRandomMeal(this.meals[this.currentIndex]);
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

  private getDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  protected setMealRecipe() {
    this.selectedMeals.push({
      mealId: this.recipe.id,
      recipeName: this.recipe.title,
      mealName: this.meals[this.currentIndex],
      mealTime: this.mealTimes[this.currentIndex],
      imageLink: this.recipe.image,
      mealDate: this.getDate(),
      cuisines: getSplittedString(2, this.recipe.cuisines),
    });
    if (this.currentIndex != this.meals.length-1) {
      this.currentIndex++;
      this.title = `Choose your ${this.meals[this.currentIndex]}`;
      this.getRandomMeal(this.meals[this.currentIndex]);
    } else {
      this.btnText = "Done!";
      localStorage.setItem("isSelecting", JSON.stringify(this.isSelecting = false))
      this.jwtService.addMealsForDay(this.selectedMeals);
      this.selectedMeals = [];
    }
  }

  completeMeal() {
    this.caloriePercentage = (356 / this.dietaryInfo.dcr) * 100;
    const selectedMeal = this.selectedMeals[this.currentIndex];
    if (selectedMeal) {
      const meal = this.getThisMeal(selectedMeal.mealId);
      this.jwtService.setMealCompleted(meal.mealId, this.getTime());
    }
  }
  getTime(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  getMealIngredients(ingredients: any) {
    return getSplittedString(1, ingredients);
  }

  getRecipeCuisines(cuisines: any) {
    return getSplittedString(2, cuisines);
  }

  // gets infomation from spoonacular about the meal selected by the user
  protected getThisMeal(mealId: number): any {
    this.spoonacularService.getRecipeById(mealId).subscribe((data: any) => {
      this.recipe = data;
    });
  }

  // gets a random meal from source
  protected getRandomMeal(mealName: string) {
    this.recipe = this.spoonacularService.getRandomRecipe(mealName, this.dietaryInfo).subscribe((data: { recipes: any[]; }) => {
      data = data.recipes[0];
      this.recipe = data;
    });
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
