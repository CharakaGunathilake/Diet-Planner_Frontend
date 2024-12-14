import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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
  @Input() public passedObj: any = {};
  mealTime: string;
  title: string;
  btnText: string;
  userDetails: any;
  currentIndex: any;
  selectedMeals: any;
  isSelecting: Boolean;
  protected recipe: any = {};

  constructor(
    private jwtService: JwtService,
    private spoonacularService: SpoonacularService
  ) {
    this.btnText = "Next";
    this.currentIndex = 0;
    this.selectedMeals = new Array({ mealId: 0, recipeName: '', mealName: '', mealTime: '', imageLink: '' });
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    this.title = "";
    this.mealTime = "";
  }

  ngOnInit(): void {
    this.jwtService.getSelectedMeals().subscribe((data) => {
      this.selectedMeals = data;
      if (this.isSelecting) {
        this.getRandomMeal(this.selectedMeals[this.currentIndex].mealName);
      } else {
        this.selectedMeals.forEach((meal: any) => {
          if (meal.completedMeal) {
            this.currentIndex++;
          }
        });
        this.getThisMeal(this.selectedMeals[this.currentIndex].mealId);
      }
    });
  }

  protected setMealRecipe() {
    if (this.currentIndex != this.selectedMeals.length) {
      this.selectedMeals.at(this.currentIndex).mealId = this.recipe.id;
      this.selectedMeals.at(this.currentIndex).recipeName = this.recipe.title;
      this.selectedMeals.at(this.currentIndex).imageLink = this.recipe.image;
      this.selectedMeals.at(this.currentIndex).cuisines = getSplittedString(2, this.recipe.cuisines);
      this.currentIndex++;
      console.log(this.selectedMeals);
      this.mealTime = this.selectedMeals[this.currentIndex].mealTime;
      this.getRandomMeal(this.selectedMeals[this.currentIndex].mealName);
    } else {
      console.log("done");
      this.btnText = "Done!";
      localStorage.setItem("isSelecting", JSON.stringify(false))
      this.selectedMeals.forEach((meal: any) => {
        this.jwtService.addMealsForDay(meal).subscribe((data) => {
          console.log(data);
        });
      })
    }
  }

  completeMeal() {
    const selectedMeal = this.selectedMeals.at(this.currentIndex);
    console.log(selectedMeal.mealId);
    if (selectedMeal) {
      this.jwtService.setMealCompleted(selectedMeal.mealName).subscribe((data) => {
        if (data) {
          alert(`meal ${selectedMeal.mealName} is completed!`);
        } else {
          alert(`meal ${selectedMeal.mealName} is not completed!`);
        }
      });
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
    this.mealTime = this.selectedMeals[this.currentIndex].mealTime;
    this.recipe = this.spoonacularService.getRandomRecipe(mealName, this.passedObj).subscribe((data: { recipes: any[]; }) => {
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
