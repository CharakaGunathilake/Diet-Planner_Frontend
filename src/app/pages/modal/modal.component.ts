import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BmicalculatorComponent } from '../../common/bmicalculator/bmicalculator.component';
import { RegisterComponent } from '../register/register.component';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../data.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgFor, BmicalculatorComponent, RegisterComponent, FormsModule, HttpClientModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  template: `<app-details [data]="parentData"></app-details>`,
  providers: [DataService]
})
export class ModalComponent implements OnInit {
  @ViewChild('staticBackdrop') registerModal!: ElementRef;
  private baseUrl: String = "http://localhost:8080/";
  constructor(private router: Router,private dataService: DataService) { }
  public userResponseObject: any = [];

  async ngOnInit(): Promise<void> {
    await this.getQuiz();
    this.displayQuiz(0);
  }

  sendData() {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 25
    };
    console.log(userData);
    
    this.dataService.setUserData(userData);
  }

  protected calculation: boolean = false;
  protected quizObjectList: any = null;
  protected question: String = "";
  protected description: String = "";
  protected option: any = null;
  protected unit: String = "";
  protected bool: boolean = false;
  protected textUnit: boolean = false;
  protected type:String = "";
  private currentIndex = 1;
  protected placeholder: String = "";
  protected dash: String = "-";
  protected btnText: String = "Next";
  public userResponseObjectACTUAL: any = [];
  protected response: any = null;
  private multipleChoice: any = [];
  private questionType: string = "";
  protected color: string = "secondary";


  protected handleClickEvent(response: any): void {
    this.catchResponse(response);
  }


  catchResponse(response: any) {
    if (this.questionType === "MULTIPLE") {
      if (!this.multipleChoice.includes(response)) {
        this.multipleChoice.push(response);
        this.color = "success";
        console.log(this.multipleChoice);
      }else{
        this.multipleChoice.pop(response);
      }
    } else {
      this.userResponseObjectACTUAL.push(response);
      this.nextQuestion(false);
    }
  }

  protected nextQuestion(bool: boolean): void {
    if (this.currentIndex >= this.quizObjectList.length) {
      this.userResponseObject = this.userResponseObjectACTUAL;
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
        } else if (this.questionType === "CALCULATION"){
          this.userResponseObjectACTUAL.push(localStorage.getItem("BMI"));
          localStorage.removeItem("BMI");
        }
        console.log(this.userResponseObjectACTUAL);
      }
      this.displayQuiz(this.currentIndex++);
    }
  }

  private openModal() {
    const modal = new Modal(this.registerModal.nativeElement);
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