import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DietaryinfoService {

  private gender: String; 
  private birthDay: Date; 
  private age: Number;
  private height: Number;
  private weight: Number;
  private dietPreference: String;
  private activityRate: String;
  private goal: String;
  private specificCuisine: String;
  private intolerances: String;
  private targetWeight: Number;
  private targetDateString: String;
  private caloriesDeficit: Number;
  private waterIntake: Number;
  private sleepPattern: String;
  private stressFrequency: String;
  private mealPlan: Number;
  private cookingHabit: String;

  constructor(
    gender: String, birthDay: Date, age: Number, height: Number, weight: Number, dietPreference: String, activityRate: String, goal: String, specificCuisine: String,
    intolerances: String, targetWeight: Number, targetDateString: String, caloriesDeficit: Number, waterIntake: Number, sleepPattern: String, stressFrequency: String,
    mealPlan: Number, cookingHabit: String
  ) {
    this.gender = gender;
    this.birthDay = birthDay;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.dietPreference = dietPreference;
    this.activityRate = activityRate;
    this.goal = goal;
    this.specificCuisine = specificCuisine;
    this.intolerances = intolerances;
    this.targetWeight = targetWeight;
    this.targetDateString = targetDateString;
    this.caloriesDeficit = caloriesDeficit;
    this.waterIntake = waterIntake;
    this.sleepPattern = sleepPattern;
    this.stressFrequency = stressFrequency;
    this.mealPlan = mealPlan;
    this.cookingHabit = cookingHabit;
  }

  getgender() { return this.gender; }
  getbirthDay() { return this.birthDay; }
  getage() { return this.age; }
  getheight() { return this.height; }
  getweight() { return this.weight; }
  getdietPreference() { return this.dietPreference; }
  getactivityRate() { return this.activityRate; }
  getgoal() { return this.goal; }
  getspecificCuisine() { return this.specificCuisine; }
  getintolerances() { return this.intolerances; }
  gettargetWeight() { return this.targetWeight; }
  gettargetDateString() { return this.targetDateString; }
  getcaloriesDeficit() { return this.caloriesDeficit; }
  getwaterIntake() { return this.waterIntake; }
  getsleepPattern() { return this.sleepPattern; }
  getstressFrequency() { return this.stressFrequency; }
  getmealPlan() { return this.mealPlan; }
  getcookingHabit() { return this.cookingHabit; }

}
  