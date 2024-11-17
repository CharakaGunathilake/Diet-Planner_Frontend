import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MealInfoserviceService {
  private mealId: Number;
  private mealName: String;
  private description: String;
  private ingredients: String;
  private cuisines: String;
  private imageLink: String;
  private instructions: String;
  private calories: Number;
  private mealTime: String;
  private credits: String;
  private userId: Number;
  private nutrients: {
    calories: Number,
    carbs: Number,
    protein: Number,
    fat: Number
    sugar: Number
    cholesterol: Number
    sodium: Number
    fiber: Number
    vitaminA: Number
    vitaminC: Number
    vitaminB1: Number
    vitaminB2: Number
    potassium: Number
    calcium: Number
    iron: Number
  }

  constructor(
    mealId: Number,
    mealName: String,
    description: String,
    ingredients: String,
    cuisines: String,
    imageLink: String,
    instructions: String,
    calories: Number,
    mealTime: String,
    credits: String,
    userId: Number,
    nutrients: {
      calories: Number,
      carbs: Number,
      protein: Number,
      fat: Number
      sugar: Number
      cholesterol: Number
      sodium: Number
      fiber: Number
      vitaminA: Number
      vitaminC: Number
      vitaminB1: Number
      vitaminB2: Number
      potassium: Number
      calcium: Number
      iron: Number
    }
  ) {
    this.mealId = mealId;
    this.mealName = mealName;
    this.description = description;
    this.ingredients = ingredients;
    this.cuisines = cuisines;
    this.imageLink = imageLink;
    this.instructions = instructions;
    this.calories = calories;
    this.mealTime = mealTime;
    this.credits = credits;
    this.userId = userId;
    this.nutrients = nutrients
  }
}
