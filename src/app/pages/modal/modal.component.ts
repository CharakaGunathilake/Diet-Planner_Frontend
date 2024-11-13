import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BmicalculatorComponent } from '../../common/bmicalculator/bmicalculator.component';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from '../../common/details/details.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgFor, BmicalculatorComponent, DetailsComponent, FormsModule, HttpClientModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('staticBackdrop') detailsModal!: ElementRef;
  @ViewChild("responseField") responseField!: ElementRef;
  ngAfterViewInit() {
  }
  private baseUrl: String = "http://localhost:8080/";
  constructor(private router: Router, private http: HttpClient) {
    this.getQuiz();
  }


  private async getQuiz() {
    this.http.get<any[]>(`${this.baseUrl}quiz/getAll`).subscribe((data) => {
      this.quizObjectList = data;
      this.displayQuiz(0);
    });
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
  protected min: any = "";
  protected max: any = "";
  protected warn: boolean = false;


  protected handleClickEvent(response: any): void {
    this.catchResponse(response);
  }

  signUp() {
    const userObj = this.userResponseObjectACTUAL;
    this.router.navigate(["/details"], { state: { userResponseObjectACTUAL: userObj } });
  }

  validate() {
    if (!this.response < this.min && this.response !> this.max) {
      this.warn = true;
    } else {
      this.warn = false;
      this.nextQuestion(true);
    }
  }

  catchResponse(response: any) {
    if (this.questionType === "MULTIPLE") {
      if (!this.multipleChoice.includes(response)) {
        this.multipleChoice.push(response);
        this.responseField.nativeElement.color = "green";
        this.color = "success";
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
      }
      this.displayQuiz(this.currentIndex++);
    }
  }

  private openModal() {
    const modal = new Modal(this.detailsModal.nativeElement);
    modal.show();
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
        this.min = "1940-01-01";
        this.max = "2014-12-31";
        this.type = "date";
        this.textUnit = true;
      } break;
      case 3: {
        this.type = "number";
        this.min = "50";
        this.max = "240";
        this.placeholder = "Height"
        this.textUnit = true;
        this.unit = "cm";
      } break;
      case 4: {
        this.type = "number";
        this.min = "20";
        this.max = "200";
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


