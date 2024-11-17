import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-meal-modal',
  standalone: true,
  imports: [NgIf, NgFor, HttpClientModule,],
  templateUrl: './meal-modal.component.html',
  styleUrl: './meal-modal.component.css'
})
export class MealModalComponent {
  private baseUrl: String = "http://localhost:8080/";
  private spoonacularBaseUrl: String = "https://api.spoonacular.com/recipes/";
  private apiKey = "eb486ae5bf864471b925f2f6d660ba1d";
  protected chart1: any;
  protected chart2: any;
  protected image = new Image();
  private userId = 2;
  protected userDetails: any = {};
  protected userDietaryInfo: any = {};
  protected meals: String[] = ["Breakfast", "Lunch", "Dinner"];
  protected mealTimes: string[] = [];
  protected currentIndex = 0;
  protected title: String = "Choose your Breakfast";
  protected isSelecting: boolean = localStorage.getItem("isSelecting") == "true" ? true : false;
  protected btnText: String = "Choose This";
  protected mealsDescription: any = null;
  private selectedMeals: any[] = [];

  mealObj = {
    mealId: 0,
    mealName: "",
    description: null,
    ingredients: "",
    cuisines: "",
    imageLink: "",
    instructions: "",
    calories: 0,
    mealTime: "",
    credits: ""
  }

  ngOnInit(): void {
    this.getUserDetails(this.userId);
  }

  constructor(private http: HttpClient) { }

  showDetails(key: number, mealName: String) {
    this.title = mealName;
    this.getThisMeal(this.selectedMeals.at(key).mealId);
  }
  
  getThisMeal(mealId: number) {
    console.log(mealId);    
    this.http.get<any>(`${this.spoonacularBaseUrl}${mealId}/information?apiKey=${this.apiKey}&includeNutrition=true`).subscribe((data) => {
      console.log(data);
      this.mealObj = {
        mealId: data.id,
        mealName: data.title,
        description: data.summary,
        ingredients: getSplittedString(1, data.extendedIngredients),
        cuisines: getSplittedString(2, data.cuisines),
        imageLink: data.image,
        instructions: data.instructions,
        calories: data.nutrients.calories.amount,
        mealTime: data.readyInMinutes,
        credits: data.creditsText
      }
    });
  }

  private getUserDetails(userId: number): void {
    this.http.get<any>(`${this.baseUrl}user/get-userWithPlan-byId/${userId}`).subscribe((data: any) => {
      console.log(data);
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
    })
  }

  getSomethingElse(index: number) {
    this.getRandomMeal(this.meals[index]);
  }

  protected setMeal() {
    if (this.currentIndex != this.meals.length) {
      this.title = `Choose your ${this.meals[this.currentIndex]}`;
      this.addMeal(this.mealObj);
      this.getSomethingElse(this.currentIndex++);
      this.currentIndex == this.meals.length ? this.btnText = "Done" : this.btnText = "Choose This";
    } else {
      this.isSelecting = false;
      localStorage.setItem("isSelecting", "false");
      this.getSelectedMeals();
    }
  }

  private addMeal(mealObj: any) {
    mealObj.userId = this.userId;
    mealObj.mealTime = this.mealTimes[this.currentIndex];
    console.log(mealObj);

    this.http.post<any>(`${this.baseUrl}meal-info/add-meal-info`, mealObj).subscribe((data) => {
      console.log(data);
    });
  }

  private getSelectedMeals() {
    this.http.get<any>(`${this.baseUrl}meal-info/getAllMealInfo-byUserId/${this.userId}`).subscribe((data) => {
      console.log(data);
      this.selectedMeals = data;
      console.log("this is meals", this.selectedMeals);
    });
  }

  private getRandomMeal(mealName: String): any {
    this.http.get<any>(`${this.spoonacularBaseUrl}random?apiKey=${this.apiKey}&include-tags=${mealName.toLocaleLowerCase()}`).subscribe((data) => {
      data = data.recipes[0];
      console.log(data);
      this.mealObj = {
        mealId: data.id,
        mealName: data.title,
        description: data.summary,
        ingredients: getSplittedString(1, data.extendedIngredients),
        cuisines: getSplittedString(2, data.cuisines),
        imageLink: data.image,
        instructions: data.instructions,
        calories: 0,
        mealTime: this.mealTimes[this.meals.indexOf(mealName)],
        credits: data.creditsText
      }
      return data;
    });
  }
}
function getSplittedString(index: number, array: any): string {
  let names = "";
  switch (index) {
    case 1: {
      array.forEach((obj: any) => {
        obj.name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);
        names += obj.amount + " " + obj.unit + " " + obj.name + ", ";
      })
      return names = names.substring(0, names.length - 2);
    }
    case 2: {
      if (array.length == 0) {
        return "Common"
      } else {
        array.forEach((obj: any) => {
          names += obj + ", ";
        })
        return names = names.substring(0, names.length - 2);
      }
    } default: {
      return "none";
    }
  }
}
