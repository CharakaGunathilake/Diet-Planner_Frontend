import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MealInfoserviceService {
  public mealId: Number;
  public mealName: String;
  public description: String;
  public ingredients: String;
  public cuisines: String;
  public imageLink: String;
  public instructions: String;
  public calories: Number;
  public mealTime: String;
  public credits: String;
  public userId: Number;
  public carbs: Number;
  public protein: Number;
  public fat: Number;
  public sugar: Number;
  public cholesterol: Number;
  public sodium: Number;
  public fiber: Number;
  public vitaminA: Number;
  public vitaminC: Number;
  public vitaminB1: Number;
  public vitaminB2: Number;
  public potassium: Number;
  public calcium: Number;
  public iron: Number;

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
    carbs: Number,
    protein: Number,
    fat: Number,
    sugar: Number,
    cholesterol: Number,
    sodium: Number,
    fiber: Number,
    vitaminA: Number,
    vitaminC: Number,
    vitaminB1: Number,
    vitaminB2: Number,
    potassium: Number,
    calcium: Number,
    iron: Number,
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
    this.carbs = carbs,
      this.protein = protein,
      this.fat = fat,
      this.sugar = sugar,
      this.cholesterol = cholesterol,
      this.sodium = sodium,
      this.fiber = fiber,
      this.vitaminA = vitaminA,
      this.vitaminC = vitaminC,
      this.vitaminB1 = vitaminB1,
      this.vitaminB2 = vitaminB2,
      this.potassium = potassium,
      this.calcium = calcium,
      this.iron = iron
  }
}
