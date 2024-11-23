import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import bootstrap, { Modal } from 'bootstrap';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule, NgFor, NgIf, NgClass, NgStyle],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('staticBackdrop') mealModal!: ElementRef
  private baseUrl: String = "http://localhost:8080/";
  private spoonacularBaseUrl: String = "https://api.spoonacular.com/recipes/";
  private apiKey = "4e17416fa2b3412897f061c2d9df1cbd";
  protected chart1: any;
  protected chart2: any;
  protected image = new Image();
  private userId: number = 0;
  protected userDetails: any = {};
  protected userDietaryInfo: any = {};
  protected meals: string[] = [""];
  protected mealTimes: string[] = [];
  protected currentIndex = 0;
  protected title: String = "";
  protected isSelecting: boolean = false;
  protected btnText: String = "Choose This";
  protected selectedMeals: any[] = [];
  protected completed: String = "";
  protected weightPercentage = 1;
  protected caloriePercentage = 1;
  protected waterIntake = localStorage.getItem("waterIntake") ? JSON.parse(localStorage.getItem("waterIntake") || "0") : 0;
  protected isStarter = localStorage.getItem("isStarter") ? JSON.parse(localStorage.getItem("isStarter") || "false") : false;
  protected completedMeals = 0;
  protected userLogin: any = {};
  protected bool = false;

  constructor(private http: HttpClient) { }
  ngAfterViewInit(): void {
    if (this.isStarter) {
      this.openModal("Welcome to SmartPlate!");
      this.btnText = "Start!";
      this.isStarter = false;
    }
    this.getSelectedMeals();
    localStorage.setItem("completedMeals", JSON.stringify(0));
  }

  getDate() {
    const date = new Date();
    const newdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // if (newdate != localStorage.getItem("currentDate")) {
    //   this.waterIntake;
    //   localStorage.setItem("waterIntake", JSON.stringify(0));
    //   this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    //   this.getUserDetails(this.userId);
    // }
    return newdate;

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
    date: this.getDate(),
    mealDate: this.getDate()
  }

  //---------------------------- This component's code starts here --------------------------------------//
  ngOnInit(): void {
    if (!this.isSelecting) {
      this.bool = true;
      this.userId = JSON.parse(localStorage.getItem("currentUserId") || "0")
      this.getUserDetails(this.userId);
    } 
    this.image.src = 'icons/water.png';
    this.chart1 = new Chart("progressChart", weeklyCalorieChart());
  }

  private openModal(title: String) {
    this.title = title;
    const modal = new Modal(this.mealModal.nativeElement);
    modal.show();
  }

  protected completeMeal() {
    this.caloriePercentage = (356 / this.userDietaryInfo.dcr) * 100;
    const obj = this.getThisMeal(this.selectedMeals.at(this.currentIndex).mealId);
    this.setMealCompleted(true, this.userId, obj.mealId, this.getDate());
    this.completed = this.meals[this.currentIndex];
  }

  // set the selected meal as completed
  setMealCompleted(status: boolean, userId: number, mealId: number, dateCompleted: string) {
    this.http.get<any>(`${this.baseUrl}meal-Info/setMealCompleted/${status}/${userId}/${mealId}/${dateCompleted}`).subscribe((data) => {
    });
  }

  protected updateWaterIntake(status: boolean) {
    if (this.waterIntake < this.userDietaryInfo.waterIntake) {
      this.waterIntake = status == true ? this.waterIntake + 1 : this.waterIntake != 0 ? this.waterIntake - 1 : 0;
      localStorage.setItem("waterIntake", JSON.stringify(this.waterIntake));
      this.chart2.destroy();
      this.chart2 = new Chart("waterChart", dailyWaterIntakerChart(this.image, this.waterIntake, this.userDietaryInfo.waterIntake));
    } else {
      alert("Congratulations!! you have completed today's Hydration target.")
    }
  }

  private getUserDetails(userId: number): void {
    this.http.get<any>(`${this.baseUrl}user/get-userWithPlan-byId/${userId}`).subscribe((data: any) => {
      console.log(data);      
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
      this.userLogin = data.login;
      this.setMealTimes(data.dietaryInfo.mealPlan);
      this.getSelectedMeals();
      console.log(this.selectedMeals);
      
      this.chart2 = new Chart("waterChart", dailyWaterIntakerChart(this.image, this.waterIntake, this.userDietaryInfo.waterIntake));
    })
  }
  // ---------------------------- This component's code ends here  -------------------------------------// 

  showDetails(key: number, mealName: String) {
    this.title = mealName;
    this.currentIndex = key;
    this.getThisMeal(this.selectedMeals.at(key).mealId);
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

  getSomething(mealName: string) {
    this.getRandomMeal(mealName);
  }

  handleClick() {
    this.isStarter = false;
    this.btnText = "Next"
    this.isSelecting = JSON.parse(localStorage.getItem("isSelecting") || "false");
    this.getRandomMeal(this.meals[this.currentIndex]);
    this.title = `Choose your ${this.meals[this.currentIndex]}`;
    this.mealObj.mealName = this.meals.at(this.currentIndex)!;
    this.mealObj.mealTime = this.mealTimes.at(this.currentIndex)!;
  }

  protected async setMealRecipe() {
    this.mealObj.mealName = this.meals.at(this.currentIndex)!;
    this.mealObj.mealTime = this.mealTimes.at(this.currentIndex)!;
    this.title = `Choose your ${this.meals[this.currentIndex + 1]}`;
    console.log(this.mealObj);
    this.selectedMeals.push(this.mealObj);
    if (this.currentIndex != this.meals.length - 1) {
      this.currentIndex++
      this.getSomething(this.meals[this.currentIndex]);
      console.log(this.selectedMeals);
    } else {
      this.btnText = "Done!";
      localStorage.setItem("isSelecting", JSON.stringify(this.isSelecting = false))
      localStorage.setItem("currentDate", JSON.stringify(this.getDate()))
      await this.addMeal(this.selectedMeals)
      this.selectedMeals = [];
      this.getSelectedMeals();
    }
  }

  // ------------------------------- http requests are here ------------------------- //
  // gets infomation from spoonacular about the meal selected by the user
  getThisMeal(mealId: number): any {
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
      this.mealObj.mealTime = this.mealTimes[this.currentIndex];
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
    const date = this.getDate();
    this.http.get<any[]>(`${this.baseUrl}meal-info/getAllMealInfo-byUserId/${this.userId}/${date}`).subscribe((data) => {
      data.forEach(meal => {
        this.getThisMeal(meal.mealId);
        this.selectedMeals = data;          
      })
    });
  }

  // gets a random meal from source
  private getRandomMeal(mealName: string) {
    const intolerances = this.userDietaryInfo.intolerances != 'none' ? this.userDietaryInfo.intolerances : "";
    const cuisines = this.userDietaryInfo.specificCuisine != 'none' ? this.userDietaryInfo.specificCuisine : "";
    const preferences = `${intolerances.toLowerCase()},${cuisines.toLowerCase()}`;
    this.http.get<any>(`${this.spoonacularBaseUrl}random?apiKey=${this.apiKey}&include-tags=${mealName.toLowerCase()},${intolerances}&exclude-tags=${cuisines}`).subscribe((data) => {
      data = data.recipes[0];
      this.mealObj = {
        mealId: data.id,
        mealName: mealName,
        recipeName: data.title,
        description: data.summary,
        ingredients: getSplittedString(1, data.extendedIngredients),
        cuisines: getSplittedString(2, data.cuisines),
        imageLink: data.image,
        instructions: data.instructions,
        mealTime: this.mealTimes[this.currentIndex],
        calories: 0,
        credits: data.creditsText,
        date: this.getDate(),
        mealDate: this.getDate()
      }
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

function weeklyCalorieChart(): any {
  const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Achieved',
        data: [1600, 1000, 1600, 1810, 1500, 1350, 1200],
        backgroundColor: [
          'rgba(20, 224, 17, 0.2)',
        ],
        borderColor: [
          'rgba(20, 224, 17)',
        ],
        borderWidth: 1
      },
      {
        label: 'Target Calories',
        data: [250, 1590, 1800, 1810, 1560, 1550, 1400],
        backgroundColor: [
          'rgba(255, 99, 132, 0.1)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    aspectRatio: 2,
    scales: {
      x: {
        stacked: true // Enable stacking on x-axis
      },
      y: {
        beginAtZero: true,
        stacked: true // Enable stacking on y-axis
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };
  return {
    type: 'bar',
    data: data,
    options: options,
  };
}

function dailyWaterIntakerChart(image: any, current: number, target: number): any {
  const data = {
    labels: ['Water Taken', 'Target'], // Labels for each section
    datasets: [{
      label: 'Glasses',
      data: [current, target], // Values for each section
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)'

      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    mainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      }
    },
    cutout: '70%' // Controls the thickness of the doughnut
  };

  const config: any = {
    type: 'doughnut',
    data: data,
    plugins: [{
      id: 'customCanvasBackgroundImage',
      beforeDraw: (chart2: { ctx: any; chartArea: { top: any; left: any; width: any; height: any; }; draw: () => any; }) => {
        if (image.complete) {
          const ctx = chart2.ctx;
          const { top, left, width, height } = chart2.chartArea;
          const x = left + width / 2 - image.width / 2;
          const y = top + height / 2 - image.height / 2;
          ctx.drawImage(image, x, y);
        } else {
          image.onload = () => chart2.draw();
        }
      }
    }],
    options: options
  }
  return config;
}


function reloadPage() {
  window.location.reload();
}

