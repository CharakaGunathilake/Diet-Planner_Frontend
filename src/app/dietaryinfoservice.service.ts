import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DietaryinfoserviceService {
  public gender: String = "";
  public age:Number = 0;
  public height: Number = 0;
  public weight: Number = 0;
  public dietPreference: String = "";
  public activityRate: String = "";
  public goal: String = "";
  public specificCuisine: String = "";
  public intolerances: String = "";
  public targetWeight: Number = 0;
  public targetDateString: String = "";
  public caloriesDeficit: Number = 0;
  public waterIntake: number = 0;
  public sleepPattern: String = "";
  public stressFrequency: String = "";
  public mealPlan: number = 0;
  public cookingHabit: String = "";

  constructor(gender: String, age: Number, height: Number, weight: Number, dietPreference: String, activityRate: String, goal: String, specificCuisine: String,
    intolerances: String,targetWeight: Number, targetDateString: String, caloriesDeficit: Number, waterIntake: Number, sleepPattern: String, stressFrequency: String,
    mealPlan: Number, cookingHabit: String
  ) { }
}
