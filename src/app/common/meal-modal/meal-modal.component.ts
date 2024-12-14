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
  isSelecting: Boolean;
  selectedMeals: any;
  title: string;
  userDetails: any;
  caloriePercentage: number;

  constructor(
    private jwtService: JwtService,
    private spoonacularService: SpoonacularService
  ) {
    this.caloriePercentage = 1;
    this.btnText = "Next";
    this.currentIndex = 0;
    this.selectedMeals = new Array({ mealId: 0, recipeName: '', mealName: '', mealTime: '', imageLink: '' });
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    this.title = "";
  }
  ngOnInit(): void {
    this.jwtService.getSelectedMeals().subscribe((data) => {
      this.selectedMeals = data;
      console.log(this.isSelecting);
      if(this.isSelecting)  {
        this.getRandomMeal(this.selectedMeals[this.currentIndex].mealName);
      }else{
        this.getThisMeal(this.selectedMeals[this.currentIndex].mealId);
      }
    }); 
  }

  protected setMealRecipe() {
    this.selectedMeals.at(this.currentIndex).mealId = this.recipe.id;
    this.selectedMeals.at(this.currentIndex).recipeName = this.recipe.title;
    this.selectedMeals.at(this.currentIndex).imageLink = this.recipe.image;
    this.selectedMeals.at(this.currentIndex).cuisines = getSplittedString(2, this.recipe.cuisines);
    console.log(this.selectedMeals);
    if (this.currentIndex != this.selectedMeals.length-1) {
      this.currentIndex++;
      this.getRandomMeal(this.selectedMeals[this.currentIndex].mealName);
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
    this.title = `Choose your ${mealName}`;
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
