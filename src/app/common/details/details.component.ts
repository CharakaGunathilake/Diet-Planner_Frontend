import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  @Input()userResponseObject: any = [];
  login: any;
  userObj: any;


  constructor(private userService: DataService, private dataService: DataService) { }
  userData: any;

  ngOnInit() {
    this.dataService.userData$.subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    });
  }

  private async saveUser(): Promise<void> {
    // this.userService.addUserWithPlan(this.initObject()).subscribe(response => {
    //   console.log('User added successfully:', response);
    // }, error => {
    //   console.error('Error adding user:', error);
    // });
  }

  initObject() {
    let dietaryInfoObj1: any = {
      "gender": this.userResponseObject.at(0),
      "age": calculateAge(this.userResponseObject.at(1)),
      "height": this.userResponseObject.at(2),
      "weight": this.userResponseObject.at(3),
      "dietPreference": this.userResponseObject.at(4),
      "activityRate": this.userResponseObject.at(5),
      "goal": this.userResponseObject.at(6),
      "specificCuisine": getSplittedString(this.userResponseObject.at(7)),
      "intolerances": getSplittedString(this.userResponseObject.at(8)),
      "targetWeight": this.userResponseObject.at(9),
      "targetDateString": (this.userResponseObject.at(10)),
      "caloriesDeficit": getCaloriesDeficit(this.userResponseObject.at(11)),
      "waterIntake": getWaterIntake(this.userResponseObject.at(13)),
      "sleepPattern": this.userResponseObject.at(14),
      "stressFrequency": this.userResponseObject.at(15),
      "mealPlan": getMealPlan(this.userResponseObject.at(16)),
      "cookingHabit": this.userResponseObject.at(17),
    }
    return dietaryInfoObj1;
  }
}

function calculateAge(date: any): number {
  let today = new Date();
  let birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


function getSplittedString(responseObj: []): String {
  console.log(responseObj);

  let st: String = "";
  responseObj.forEach(obj => {
    st += obj + ", ";
  })
  return st.substring(0, st.length - 2);
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
