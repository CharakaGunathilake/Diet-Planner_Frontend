import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BmicalculatorComponent } from '../../common/bmicalculator/bmicalculator.component';
import { RegisterComponent } from '../register/register.component';
import { Router, RouterLink } from '@angular/router';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../data.service';
import { HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from '../../common/details/details.component';
import { DietaryinfoserviceService } from '../../dietaryinfoservice.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgFor, BmicalculatorComponent, DetailsComponent, FormsModule, HttpClientModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  @ViewChild('staticBackdrop') detailsModal!: ElementRef;
  private baseUrl: String = "http://localhost:8080/";
  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.getQuiz();
    this.displayQuiz(0);
  }

  protected calculation: boolean = false;
  protected quizObjectList: any = null;
  protected question: String = "";
  protected description: String = "";
  protected option: any = null;
  protected unit: String = "";
  protected bool: boolean = false;
  protected textUnit: boolean = false;
  protected type: String = "";
  private currentIndex = 1;
  protected placeholder: String = "";
  protected dash: String = "-";
  protected btnText: String = "Next";
  public userResponseObjectACTUAL: any = [];
  protected response: any = null;
  private multipleChoice: any = [];
  private questionType: string = "";
  protected color: string = "secondary";

  createObject(userResponseObject: any[]) {
    return new DietaryinfoserviceService(
      userResponseObject.at(0),
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
    );
    
  }

  protected handleClickEvent(response: any): void {
    this.catchResponse(response);
  }

  signUp(){
    this.router.navigate(["/register"],{state:this.createObject(this.userResponseObjectACTUAL)});
  }

  catchResponse(response: any) {
    if (this.questionType === "MULTIPLE") {
      if (!this.multipleChoice.includes(response)) {
        this.multipleChoice.push(response);
        this.color = "success";
        console.log(this.multipleChoice);
      } else {
        this.multipleChoice.pop(response);
      }
    } else {
      this.userResponseObjectACTUAL.push(response);
      this.nextQuestion(false);
    }
  }

  protected nextQuestion(bool: boolean): void {
    if (this.currentIndex >= this.quizObjectList.length) {
      this.openModal();
    } else {
      if (bool) {
        if (this.questionType === "MULTIPLE") {
          if (this.multipleChoice.length === 0) {
            this.userResponseObjectACTUAL.push("none");
          } else {
            this.userResponseObjectACTUAL.push(this.multipleChoice);
            this.multipleChoice = [];
          }
        } else if (this.questionType === "TEXT") {
          this.userResponseObjectACTUAL.push(this.response);
          this.response = null;
        } else if (this.questionType === "CALCULATION") {
          this.userResponseObjectACTUAL.push(localStorage.getItem("BMI"));
          localStorage.removeItem("BMI");
        }
        console.log(this.userResponseObjectACTUAL);
      }
      this.displayQuiz(this.currentIndex++);
    }
  }

  private openModal() {
    const modal = new Modal(this.detailsModal.nativeElement);
    modal.show();
  }

  private async getQuiz() {
    let response = await fetch(this.baseUrl + "quiz/getAll");
    let body = await response.json();
    this.quizObjectList = body;
  }

  protected displayQuiz(index: number): void {
    this.question = this.quizObjectList[index].quizQuestion.question;
    this.description = this.quizObjectList[index].quizQuestion.description;
    this.questionType = this.quizObjectList[index].quizQuestion.questionTypeEnum;
    this.textUnit = false;
    this.option = false;
    this.bool = false;
    this.calculation = false;

    switch (this.quizObjectList[index].quizQuestion.questionTypeEnum) {
      case "SINGLE": {
        this.option = this.quizObjectList[index].quizOption;
        this.checkQuestionId(this.quizObjectList[index].id);
      } break;
      case "MULTIPLE": {
        this.bool = true;
        this.option = this.quizObjectList[index].quizOption;
      } break;
      case "TEXT": {
        this.dash = "-start-";
        this.checkQuestionId(this.quizObjectList[index].id);
      } break;
      case "CALCULATION": {
        this.textUnit = true;
        this.calculation = true;
      }
    }
  }

  private checkQuestionId(id: number) {
    switch (id) {
      case 2: {
        this.dash = "-";
        this.type = "date";
        this.textUnit = true;
      } break;
      case 3: {
        this.type = "number";
        this.placeholder = "Height"
        this.textUnit = true;
        this.unit = "cm";
      } break;
      case 4: {
        this.type = "number";
        this.placeholder = "Weight"
        this.textUnit = true;
        this.unit = "kg";
      } break;
      case 10: {
        this.textUnit = true;
      } break;
      case 12: {
        this.bool = true;
      } break;
      case 19: {
        this.bool = true;
        this.btnText = "Finish";
      } break;
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
