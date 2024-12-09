import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BmicalculatorComponent } from '../../common/bmicalculator/bmicalculator.component';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from '../../common/details/details.component';
import { JwtService } from '../../model/jwt.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgFor, BmicalculatorComponent, DetailsComponent, FormsModule, HttpClientModule, NgStyle, NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  providers: [JwtService]
})
export class ModalComponent {
  @ViewChild('staticBackdrop') detailsModal!: ElementRef;
  @ViewChild("responseField") responseField!: ElementRef;
  constructor(
    private router: Router,
    private jwtService: JwtService,
  ) {    
    this.getQuiz();
  }
  
  private getQuiz() {
    this.jwtService.getAllQuizzes().subscribe((data) => {
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
  protected questionType: string = "";
  protected color: string = "secondary";
  protected min: any = "";
  protected max: any = "";
  protected warn: boolean = false;
  private selectedItems: Set<number> = new Set<number>();
  
  changeUnit() {
    if (this.unit === "cm") {
      this.unit = "ft";
      this.max = 10;
      this.min = 4;
    } else if (this.unit === "ft") {
      this.unit = "cm"
      this.max = 240;
      this.min = 50;
    } else if (this.unit == "kg") {
      this.unit = "lb"
      this.max = 350;
      this.min = 0;
    } else if (this.unit = "lb") {
      this.unit = "kg"
      this.max = 150;
      this.min = 20;
    }
  }

  validate() {
    if (this.response != null) {
      if (this.response <= this.min || this.response >= this.max) {
        this.warn = true;
      } else {
        this.warn = false;
        this.catchByType();
      }
    } else {
      this.warn = true;
    }
  }

  toggleSelection(itemId: number) {
    if (this.selectedItems.has(itemId)) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.add(itemId);
    }
  }

  isSelected(itemId: number): boolean {
    return this.selectedItems.has(itemId);
  }

  protected handleClick(response: any): void {
    this.response = response;
    this.catchByType();
  }

  protected catchResponse(response: any) {
    this.multipleChoice.push(response);

  }

  protected catchByType() {
    if (this.currentIndex >= this.quizObjectList.length) {
      const userObj = this.userResponseObjectACTUAL;
      this.router.navigate(["/details"], { state: { userResponseObjectACTUAL: userObj } });
    } else {
      if (this.questionType === "TEXT") {
        if (this.unit === "ft") {
          this.response = this.response * 30.48;
        } else if (this.unit === "lb") {
          this.response = this.response * 0.4536;
        }
        console.log(this.response);
        this.userResponseObjectACTUAL.push(this.response);
        this.nextQuestion();
      } else if (this.questionType === "SINGLE") {
        this.response == null ? this.response = "none" : this.response;
        console.log(this.response);
        this.userResponseObjectACTUAL.push(this.response);
        this.nextQuestion();
      } else if (this.questionType === "MULTIPLE") {
        this.catchResponse(this.response);
      }
    }
  }

  protected nextQuestion(): void {
    this.selectedItems = new Set<number>();
    if (this.questionType === "MULTIPLE") {
      this.multipleChoice.length === 0 ? this.multipleChoice.push("none") : this.multipleChoice;
      this.userResponseObjectACTUAL.push(this.multipleChoice);
      this.multipleChoice = [];
    } else if (this.questionType === "CALCULATION") {
      this.userResponseObjectACTUAL.push(localStorage.getItem("BMI"));
      console.log(localStorage.getItem("BMI"))
      localStorage.removeItem("BMI");
    }
    this.response = null;
    this.displayQuiz(this.currentIndex++);
  }

  private openModal() {
    const modal = new Modal(this.detailsModal.nativeElement);
    modal.show();
  }

  private closeModal() {
    const modal = new Modal(this.detailsModal.nativeElement);
    modal.hide();
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
        this.bool = true;
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
        this.min = 50;
        this.max = 240;
        this.placeholder = "Height"
        this.textUnit = true;
        this.unit = "cm";
      } break;
      case 4: {
        this.type = "number";
        this.min = 20;
        this.max = 200;
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
        this.questionType = "MULTIPLE";
        this.btnText = "Finish";
      } break;
    }
  }
}


