import { NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [HttpClientModule,NgFor],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css'
})
export class MealsComponent implements OnInit {
  @ViewChild('staticBackdrop') mealModal!: ElementRef;
  public chart: any;

  ngOnInit() {
    this.getUserDetails(this.userId);
    this.chart = new Chart("nutritionChart", createNutritionChart());
  }
  // // 
  private baseUrl: String = "http://localhost:8080/";
  private spoonacularBaseUrl: String = "https://api.spoonacular.com/recipes/";
  private apiKey = "a4cc5dffa90c4777b649112d67c3cecc";
  protected image = new Image();
  private userId: number = 2;
  protected userDetails: any = {};
  protected userDietaryInfo: any = {};
  protected meals: string[] = ["Breakfast", "Lunch", "Dinner"];
  protected mealTimes: string[] = [];
  protected currentIndex = 0;
  protected title: String = "";
  protected isSelecting: boolean = false;
  protected btnText: String = "Choose This";
  protected selectedMeals: any[] = [];
  protected completed: String = "";
  protected completedMeals = 0;
  private date = new Date();

  constructor(private http: HttpClient) { }
  ngAfterViewInit(): void {
    this.getSelectedMeals();
    localStorage.setItem("completedMeals", JSON.stringify(0));
  }

  mealObj = {
    mealId: 0,
    recipeName: "",
    mealName: "",
    description: null,
    ingredients: "",
    cuisines: "",
    imageLink: "",
    instructions: "",
    calories: 0,
    mealTime: "",
    credits: "",
    date: this.date
  }

  //---------------------------- This component's code starts here --------------------------------------//
   openModal(title: String) {
    this.title = title;
    const modal = new Modal(this.mealModal.nativeElement);
    modal.show();
  }

  // set the selected meal as completed


  private getUserDetails(userId: number): void {
    this.http.get<any>(`${this.baseUrl}user/get-userWithPlan-byId/${userId}`).subscribe((data: any) => {
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
      this.setMealTimes(data.dietaryInfo.mealPlan);
    })
  }
  // ---------------------------- This component's code ends here  -------------------------------------// 

  showDetails(key: number, mealName: String) {
    console.log(key + " + " + mealName);
    this.title = mealName;
    this.currentIndex = key;
    this.getThisMeal(this.selectedMeals.at(key).mealId, key);
    this.openModal(`${mealName} Details`);
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

  getSomething(index: number) {
    this.mealObj.mealName = this.meals[index];
    this.mealObj.mealTime = this.mealTimes[index];
    this.title = `Choose your ${this.meals[index]}`;
    console.log(this.mealObj.mealName + " + " + this.mealObj.mealTime + " + " + index);
    this.getRandomMeal(this.mealObj.mealName);
  }

  protected async setMeal() {
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    if (this.currentIndex != this.meals.length) {
      this.btnText = "Next"
      this.selectedMeals.push(this.mealObj.mealId == 0 ? this.selectedMeals.at(this.currentIndex) : this.mealObj);
      console.log(this.selectedMeals);

      this.getSomething(this.currentIndex++);
    } else {
      localStorage.setItem("isSelecting", JSON.stringify(false))
      this.isSelecting = false;
      await this.addMeal(this.selectedMeals)
      this.getSelectedMeals();
    }
  }

  // ------------------------------- http requests are here ------------------------- //
  // gets infomation from spoonacular about the meal selected by the user
  getThisMeal(mealId: number, key: number): any {
    this.http.get<any>(`${this.spoonacularBaseUrl}${mealId}/information?apiKey=${this.apiKey}&includeNutrition=true`).subscribe((data) => {
      this.mealObj.mealId = data.id
      this.mealObj.recipeName = data.title
      this.mealObj.description = data.summary
      this.mealObj.ingredients = getSplittedString(1, data.extendedIngredients)
      this.mealObj.cuisines = getSplittedString(2, data.cuisines)
      this.mealObj.imageLink = data.image
      this.mealObj.instructions = data.instructions
      this.mealObj.calories = data.nutrition.nutrients[0].amount,
        this.mealObj.credits = data.creditsText
    });
  }

  // adds meals from the source to the database
  private async addMeal(mealArray: any[]) {
    mealArray.forEach(async mealObj => {
      mealObj.userId = this.userId;
      await this.http.post<boolean>(`${this.baseUrl}meal-info/add-meal-info`, mealObj).toPromise();
    });
  }

  // brings meals from the database
  private getSelectedMeals() {
    this.http.get<any>(`${this.baseUrl}meal-info/getAllMealInfo-byUserId/${this.userId}`).subscribe((data) => {
      this.selectedMeals = data;
      console.log(data);

    });
  }

  // gets a random meal from source
  private getRandomMeal(mealName: string) {
    this.http.get<any>(`${this.spoonacularBaseUrl}random?apiKey=${this.apiKey}&include-tags=${mealName.toLowerCase()}`).subscribe((data) => {
      data = data.recipes[0];
      this.mealObj.mealId = data.id
      this.mealObj.recipeName = data.title
      this.mealObj.description = data.summary
      this.mealObj.ingredients = getSplittedString(1, data.extendedIngredients)
      this.mealObj.cuisines = getSplittedString(2, data.cuisines)
      this.mealObj.imageLink = data.image
      this.mealObj.instructions = data.instructions
      this.mealObj.calories = data.nutrition.nutrients[0].amount,
        this.mealObj.credits = data.creditsText
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

function createNutritionChart(): any {
  //fat,carbohydrate,protein,sugar,cholesterol,fiber,vitamin A,Vitamin B2,Vitamin C,Calcium,Iron
  const data = {
    labels: [
      'Carbohydrate',
      'Protein',
      'Calcium',
      'Minerals',
      'Vitamin'
    ],
    datasets: [{
      label: 'kcal',
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)',
      ]
    }]
  };

  return {
    type: 'polarArea',
    data: data,
    options: {
      mainAspectRation: false,
      responsive: true,
    },
  };
}