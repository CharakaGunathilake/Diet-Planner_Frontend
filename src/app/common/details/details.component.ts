import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RegisterComponent } from '../../pages/register/register.component';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { LoginComponent } from '../../pages/login/login.component';
import { DietaryinfoService } from '../../model/dietaryinfo.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf, RegisterComponent, FormsModule,LoginComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  @ViewChild('staticBackdrop') detailsModal!: ElementRef;
  public userResponseObject: any = []
  ngOnInit() { }
  protected data: any[] = [];
  public dietPlan ={
    name: "",
    description:"",
  }
  protected showRegister = true;
  constructor(private router: Router) {
    this.data = this.router.getCurrentNavigation()?.extras.state?.["userResponseObjectACTUAL"]
  }

  register() {
    this.userResponseObject.push(this.initObject(this.data));
    this.userResponseObject.push(this.dietPlan)
    this.openModal();
  }

  private openModal() {
    const modal = new Modal(this.detailsModal.nativeElement);
    modal.show();
  }

  initObject(userResponseObject: any[]) {
    if (userResponseObject != null) {
      return new DietaryinfoService(
        userResponseObject.at(0),
        userResponseObject.at(1),
        calculateAge(userResponseObject.at(1)),
        userResponseObject.at(2),
        userResponseObject.at(3),
        userResponseObject.at(4),
        userResponseObject.at(5),
        userResponseObject.at(6),
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

  handleAction(){
    this.showRegister = !this.showRegister;
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
      return 8;
    case "8-12 glasses":
      return 12;
    case "More than 12 glasses":
      return 15;
    default:
      return 6;
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
      return 3;
  }
}







