import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import bootstrap, { Modal } from 'bootstrap';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule, NgFor,NgIf],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit,AfterViewInit{
  @ViewChild('staticBackdrop') mealModal!: ElementRef
  private baseUrl: String = "http://localhost:8080/";
  private spoonacularBaseUrl: String = "https://api.spoonacular.com/recipes/";
  private apiKey = "a4cc5dffa90c4777b649112d67c3cecc";
  protected chart1: any;
  protected chart2: any;
  protected image = new Image();
  private userId = 2;
  protected userDetails: any = {};
  protected userDietaryInfo: any = {};
  protected meals:String[] = ["Breakfast", "Lunch", "Dinner"];
  protected mealTimes: String[] = [];
  protected currentIndex = 0;
  protected title:String = "";
  protected isSelecting: boolean = true;
  protected btnText: String = "Choose This";
  protected mealsDescription:any = null;

  constructor(private http: HttpClient) {
    
   }
  ngAfterViewInit(): void {
    if(this.isSelecting){
      // this.getSomethingElse(this.currentIndex);
      this.openModal(`Choose your ${this.meals[this.currentIndex++]}`);
    }
  }

  mealObj = {
    mealId: 0,
    mealName: "",
    description: null,
    ingredients: [""],
    mealCuisine: [""],
    mealImage: new Image(),
    instruction: "",
    mealCalories: 0,
    credits:""
  }

  ngOnInit(): void {
    this.image.src = 'icons/water.png';
    this.chart1 = new Chart("progressChart", weeklyCalorieChart());
    this.chart2 = new Chart("waterChart", dailyWaterIntakerChart(this.image));
    this.getUserDetails();
  }

  showDetails(mealName:String) {
    this.title = mealName;
    this.openModal(`${mealName} Details`);
  }

  private getUserDetails(): void {
    this.http.get<any>(`${this.baseUrl}user/get-userWithPlan-byId/${this.userId}`).subscribe((data: any) => {
      console.log(data);
      this.userDetails = data.user;
      this.userDietaryInfo = data.dietaryInfo;
      this.setMealTimes(data.dietaryInfo.mealPlan);
    })
  }

  private openModal(title: String) {
    this.title = title;
    const modal = new Modal(this.mealModal.nativeElement);
    modal.show();
  }

  closeModal(): void {
    const modal = new Modal(this.mealModal.nativeElement);
    modal.hide();
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
        this.meals = ["Breakfast","Second Breakfast", "Lunch","Afternoon Snack", "Dinner"];
        this.mealTimes = ["Between 6:00 AM and 8:00 AM", "Between 8:00 AM and 11:00 AM", "Between 11:00 AM and 1:00 PM", "Between 3:00 PM and 5:00 PM", "7:00 PM"];
        break;
    }
  }

  getSomethingElse(index: number){
    this.getRandomMeal(this.meals[index]);
  }

  protected setMeal(){
    if(this.currentIndex != this.meals.length){
      this.title = `Choose your ${this.meals[this.currentIndex]}`;
      console.log("here is the index", this.currentIndex);
      this.getSomethingElse(this.currentIndex++);
      this.currentIndex == this.meals.length ? this.btnText = "Done" : this.btnText = "Choose This";
    }else{  
      this.isSelecting = false;
      localStorage.setItem("isSelecting", "false");
    }
  }

  private getRandomMeal(mealName:String):any{
    this.http.get<any>(`${this.spoonacularBaseUrl}random?apiKey=${this.apiKey}&include-tags=${mealName.toLocaleLowerCase()}`).subscribe((data) => {
      data = data.recipes[0];
      console.log(data);
      this.mealObj={
        mealId : data.id,
        mealName: data.title,
        description: data.summary,
        ingredients: this.getIngredientNames(data.extendedIngredients),
        mealCuisine: getCusines(data.cuisines),
        mealImage: data.image,
        instruction: data.summary,
        mealCalories: data.calories,
        credits:data.creditsText
      }     
      return data;
    });
  }
  getIngredientNames(extendedIngredients: any): string[] {
    let names: any[] = [];
    extendedIngredients.forEach((ingredient: any) => {
      ingredient.name = ingredient.name.charAt(0).toUpperCase()+ingredient.name.slice(1);
      names.push((" " + ingredient.amount + " " + ingredient.unit + " "+ingredient.name).trimEnd());
    })
    return names;
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

function dailyWaterIntakerChart(image: any): any {
  const data = {
    labels: ['Water Taken', 'Target'], // Labels for each section
    datasets: [{
      label: 'Glasses',
      data: [2, 10], // Values for each section
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

function getText(summary: any): any {
  console.log(summary.charAt(0));
  return summary;
}
function getCusines(cuisines: string[]): string[] {
  return cuisines.length == 0? cuisines=["General"]: cuisines;
}

