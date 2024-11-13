import { Component, Input, OnInit } from '@angular/core';
import { DietaryinfoserviceService } from '../../dietaryinfoservice.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RegisterComponent } from '../../pages/register/register.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf, RegisterComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  public userResponseObject: any;
  ngOnInit() { }
  protected data: any[] = [];
  protected showRegister = false;
  constructor(private router: Router) {
    this.data = this.router.getCurrentNavigation()?.extras.state?.["userResponseObjectACTUAL"]
    console.log(this.data);
    console.log(this.initObject(this.data));
  }

  register() {
    this.userResponseObject = this.initObject(this.data);
    this.showRegister = true;
  }

  initObject(userResponseObject: any[]) {
    if (userResponseObject != null) {
      return new DietaryinfoserviceService(
        userResponseObject.at(0),
        userResponseObject.at(1),
        calculateAge(userResponseObject.at(1)),
        userResponseObject.at(2),
        userResponseObject.at(3),
        userResponseObject.at(6),
        userResponseObject.at(5),
        userResponseObject.at(4),
        getSplittedString(userResponseObject.at(7)),
        getSplittedString(userResponseObject.at(8)),
        userResponseObject.at(9),
        userResponseObject.at(10),
        getCaloriesDeficit(userResponseObject.at(11)),
        getWaterIntake(userResponseObject.at(13)),
        userResponseObject.at(14),
        userResponseObject.at(15),
        getMealPlan(userResponseObject.at(16)),
        userResponseObject.at(17)
      )
    } else {
      return null;
    }
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







