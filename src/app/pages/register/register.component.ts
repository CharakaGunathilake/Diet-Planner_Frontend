import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  private baseUrl: String = "http://localhost:8080/";
  private header = { "Content-Type": "application/json" };

  constructor(private router: Router) { }
  @Input() userResponseObject!: any[];
  ngOnInit(): void {
    // console.log(this.userResponseObject);
  }

  protected passwordNew: string = "";
  protected passwordConfirm: string = "";
  protected expression: boolean = false;

  protected dietaryInfoObj: any = {
    age: 0,
    height: 0,
    weight: 0,
    dietPreference: "",
    activityRate: "",
    goal: "",
    specificCuisine: "",
    intolerances: "",
    targetWeight: 0,
    targetDate: "",
    caloriesDeficit: 0,
    bmi: 0,
    waterIntake: 0,
    sleepPattern: "",
    stressFrequency: "",
    caloriesNeeded: 0,
    mealPlan: 0,
    cookingHabit: "",
    dcr: 0,
    bmiStatus: "",
    userId: 0
  }

  protected userObj: any = {
    firstName: "",
    lastName: "",
    gender: "",
    birthDay: undefined,
    age: 0,
    height: 0,
    weight: 0,
    email: "",
    status: Boolean,
    regDate: Date,
  }

  protected login: any = {
    username: "",
    password: "",
    Date
  }
  protected async showData(): Promise<void> {
    const userObj: any = this.initObject();
    console.log(this.initObject());
    this.initObject();
    if (this.matchingPassword()) {
      if (await this.checkUserName(this.login.username)) {
        console.log("Username already taken");
      } else {
        await this.saveDietaryInfo(userObj);
        if (!await this.saveUser()) {
          if (!await this.saveLogin()) {
            // this.router.navigate(["/login"]);
          }
          localStorage.setItem("currentUser", `${this.login.username}`);
          localStorage.setItem("isloggedIn", JSON.stringify(true));
        }
      }
    } else {
      console.log("Password fields doesn't match")
    }
  }

  initObject() {
    let dietaryInfoObj1: any = {
      "age": this.calculateAge(this.userResponseObject.at(1)),
      "height": this.userResponseObject.at(2),
      "weight": this.userResponseObject.at(3),
      "dietPreference": this.userResponseObject.at(4),
      "activityRate": this.userResponseObject.at(5),
      "goal": this.userResponseObject.at(6),
      "specificCuisine": getSplittedString(this.userResponseObject.at(7)),
      "intolerances": getSplittedString(this.userResponseObject.at(8)),
      "targetWeight": this.userResponseObject.at(9),
      "targetDate": getTargetDate(this.userResponseObject.at(10)),
      "caloriesDeficit": getCaloriesDeficit(this.userResponseObject.at(11)),
      "bmi": calculateBMI(this.userResponseObject.at(2), this.userResponseObject.at(3)),
      "waterIntake": getWaterIntake(this.userResponseObject.at(13)),
      "sleepPattern": this.userResponseObject.at(14),
      "stressFrequency": this.userResponseObject.at(15),
      "caloriesNeeded": getCaloriesNeeded(this.userResponseObject.at(9), this.userObj.weight),
      "mealPlan": getMealPlan(this.userResponseObject.at(16)),
      "cookingHabit": this.userResponseObject.at(17),
      "dcr": calculateDCR(this.userResponseObject.at(9), this.userObj.weight, this.userObj.height, this.userResponseObject.at(5), this.calculateAge(this.userResponseObject.at(1))),
      "bmiStatus": getBmiStatus(calculateBMI(this.userResponseObject.at(2), this.userResponseObject.at(3))),
    }
    return dietaryInfoObj1;
  }

  async saveDietaryInfo(userObj: any): Promise<boolean> {
    let response = await fetch(this.baseUrl + "dietary-info/add-dietary-info", {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(userObj)
    });
    let body = await response.json();
    return true;
  }
  calculateAge(arg0: any) {
    let today = new Date();
    let birthDate = new Date(arg0);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private async checkUserName(username: String): Promise<boolean> {
    let response = await fetch(this.baseUrl + "login/check-username/" + `${username}`);
    return await response.json();
  }

  private matchingPassword(): boolean {
    console.log(this.passwordNew, this.passwordConfirm);
    if (this.passwordNew === this.passwordConfirm) {
      this.login.password = this.passwordConfirm;
      return true;
    } return false;
  }


  private async saveUser(): Promise<boolean> {
    let response = await fetch(this.baseUrl + "user/add-user", {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(
        this.userObj = {
          "firstName": this.userObj.firstName,
          "lastName": this.userObj.lastName,
          "gender": this.userResponseObject.at(0),
          "birthDay": this.userResponseObject.at(1),
          "age": this.calculateAge(this.userResponseObject.at(1)),
          "height": this.userResponseObject.at(2),
          "weight": this.userResponseObject.at(3),
          "email": this.userObj.email,
          "status": true,
          "regDate": new Date()
        }
      )
    });
    let body = await response.json()
    alert(JSON.stringify(body));
    return body;
  }

  private async saveLogin(): Promise<boolean> {
    console.log(this.login.username);
    console.log(this.login.password);
    (this.userObj.username)
    let response = await fetch(this.baseUrl + "login/add-login", {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(
        this.login = {
          "username": this.login.username,
          "password": this.login.password,
          "loginDate": new Date()
        }
      )
    })
    let body = await response.json()
    alert(JSON.stringify(body));
    return body;
  }

}

function getSplittedString(responseObj: any[]): String {
  let st: String = "";
  responseObj.forEach(obj => {
    st += obj + ", ";
  })
  return st + "\b\b";
}

function getTargetDate(responseObj: any): any {
  switch (responseObj) {
    case "1 Month":
      return new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    case "3 Months":
      return new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000);
    case "within 6 Months":
      return new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000);
    case "1 Year":
      return new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date();
  }
  ;
}

function getCaloriesDeficit(responseObj: any) {
  switch (responseObj) {
    case "250 kcal/day":
      return 250;
    case "500 kcal/day":
      return 500;
    case "750 kcal/day":
      return 750;
    default:
      return 0;
  }
}

function calculateBMI(height1: any, weight:any) {
  let height = height1 / 100;
  return (weight / (height * height));
}

function getWaterIntake(responseObj: any) {
  switch (responseObj) {
    case "Less than 4 glasses":
      return 4;
    case "4-8 glasses":
      return 6;
    case "8-12 glasses":
      return 10;
    case "More than 12 glasses":
      return 15;
    default:
      return 0;
  }
}

function getCaloriesNeeded(targetWeight: any, weight: any) {
  if (targetWeight > weight) {
    let weightDiff = targetWeight - weight;
    return weightDiff * 7700;
  } return 0;
}

function getMealPlan(responseObj: any) {
  switch (responseObj) {
    case "Set mealtimes (breakfast, lunch, dinner)":
      return 3;
    case "Set mealtimes with a snack":
      return 4;
    case "Smaller, frequent meals (4-5 times a day)":
      return 5;
    case "1-2 larger meals a day (intermittent fasting)":
      return 2;
    default:
      return 0;
  }
}

function calculateDCR(gender: any, weight: any, height: any, activityRate: any, age: number) {
  let dcr: number = 0;
  switch (gender) {
    case "Male":
      dcr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      return dcr * getActivityRate(activityRate);
    case "Female":
      dcr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      return dcr * getActivityRate(activityRate);
    default:
      return 0;
  }
}

function getActivityRate(activityRate: any) {
  switch (activityRate) {
    case "Sedentary (little to no exercise)":
      return 1.2;
    case "Lightly active (exercise 1-2 times a week)":
      return 1.375;
    case "Moderately active (exercise 3-5 times a week)":
      return 1.55;
    case "Very active (intense exercise or physical job)":
      return 1.725;
    default:
      return 0;
  }
}


function getBmiStatus(arg0: number) {
  if (arg0 < 18.5) {
    return "Underweight";
  } else if (arg0 >= 18.5 && arg0 <= 24.9) {
    return "Normal weight";
  } else if (arg0 >= 25 && arg0 <= 29.9) {
    return "Overweight";
  } else {
    return "Obese";
  }
}

