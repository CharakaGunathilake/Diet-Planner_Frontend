import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BmicalculatorComponent } from '../../common/bmicalculator/bmicalculator.component';
import { RegisterComponent } from '../register/register.component';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgFor, BmicalculatorComponent, RegisterComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'

})
export class ModalComponent implements OnInit {
  @ViewChild('staticBackdrop') registerModal!: ElementRef;
  private baseUrl: String = "http://localhost:8080/";
  constructor(private router: Router) { }
  public userResponseObject:String = "nothing here";
  
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
  protected type = "";
  protected currentIndex = 1;
  protected placeholder: String = "";
  protected dash: String = "-";
  protected btnText: String = "Next";

  protected nextQuestion(): void {
    this.displayQuiz(this.currentIndex++);
  }

  private openModal() {
    const modal = new Modal(this.registerModal.nativeElement);
    modal.show();
  }

  private async getQuiz() {
    let response = await fetch(this.baseUrl + "quiz/getAll");
    let body = await response.json();
    this.quizObjectList = body;
    console.log(this.quizObjectList);
  }

  protected displayQuiz(index: number): void {
    if (index >= this.quizObjectList.length) {
      this.openModal()
    } else {
      this.question = this.quizObjectList[index].quizQuestion.question;
      this.description = this.quizObjectList[index].quizQuestion.description;
      console.log(index, length);
      this.textUnit = false;
      this.option = false;
      this.bool = false;
      this.calculation = false;
    }

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

