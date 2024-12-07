import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Modal } from 'bootstrap';
import { SpoonacularServiceService } from '../../model/spoonacular-service.service';

@Component({
  selector: 'app-meal-modal',
  standalone: true,
  imports: [NgIf, NgFor, HttpClientModule,],
  templateUrl: './meal-modal.component.html',
  styleUrl: './meal-modal.component.css',
  providers: [Modal, SpoonacularServiceService]
})
export class MealModalComponent {
  protected recipe: any = {};
  btnText: string;
  currentIndex: any;
  constructor(
    private spoonacularService: SpoonacularServiceService
  ) { }

  handleClick() {
    this.btnText = "Next"
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    this.getRandomMeal(this.meals[this.currentIndex]);
    this.title = `Choose your ${this.meals[this.currentIndex]}`;
  }

  protected setMealRecipe() {
    this.title = `Choose your ${this.meals[this.currentIndex]}`;
    this.selectedMeals.push({
      mealId: this.recipe.id,
      recipeName: this.recipe.title,
      mealName: this.meals[this.currentIndex],
      mealTime: this.mealTimes[this.currentIndex],
      imageLink: this.recipe.image
    });
    if (this.currentIndex != this.meals.length - 1) {
      this.getRandomMeal(this.meals[this.currentIndex++]);
      console.log(this.selectedMeals);
    } else {
      this.btnText = "Done!";
      localStorage.setItem("isSelecting", JSON.stringify(this.isSelecting = false))
      this.jwtService.addMealsForDay(this.selectedMeals);
      this.selectedMeals = [];
      this.getSelectedMeals();
    }
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
