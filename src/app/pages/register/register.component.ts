import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';
import { Modal } from 'bootstrap';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, ModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  @ViewChild('staticBackdrop1') loginModal!: ElementRef;
  private baseUrl: String = "http://localhost:8080/";
  private header = { "Content-Type": "application/json" };
  ngOnInit(): void {
  }
  protected passwordNew: string = "";
  protected passwordConfirm: string = "";
  protected expression: boolean = false;
  protected quizObj: any = [];
  protected userObj = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    regDate: new Date()
  }

  private openModal() {
    const modal = new Modal(this.loginModal.nativeElement);
    modal.show();
  }

  protected async showData(): Promise<void> {
    this.getQuiz();
    console.log(this.quizObj);

    if (this.matchingPassword()) {
      if (await this.checkUserName(this.userObj.username)) {
        console.log("Username already taken");
      } else {
        console.log(this.userObj);
        this.saveUser();
        localStorage.setItem("currentUser", `${this.userObj.username}`);
        this.saveLogin();
      }
    } else {
      console.log("Password fields doesn't match")
    }
  }
  private async checkUserName(username: String): Promise<boolean> {
    let response = await fetch(this.baseUrl + "login/check-username/" + `${username}`);
    return await response.json();
  }

  private matchingPassword(): boolean {
    if (this.passwordNew === this.passwordConfirm) {
      this.userObj.password = this.passwordConfirm;
      return true;
    } return false;
  }
  private user: any = {
    "firstName": this.userObj.firstName,
    "lastName": this.userObj.lastName,
    "gender": "Male",
    "birthDay": "2000-05-15",
    "age": 24,
    "height": 5.8,
    "weight": 70,
    "email": this.userObj.email,
    "status": "true",
    "regDate": this.userObj.regDate
  }

  private login: any = {
    "username": this.userObj.username,
    "password": this.userObj.password
  }

  private async saveUser() {
    let response = await fetch(this.baseUrl + "user/add-user", {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(this.user)
    })
    let body = await response.json()
    alert(JSON.stringify(body));
  }

  private async saveLogin() {
    let response = await fetch(this.baseUrl + "login/add-login", {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(this.login)
    })
    let body = await response.json()
    alert(JSON.stringify(body));
  }

  private async getQuiz() {
    let response = await fetch(this.baseUrl + "quiz-questions/getAll");
    let body = await response.json();
    this.quizObj = body;
    console.log(this.quizObj[0].id + " - " + this.quizObj[0].question);
    this.openModal();
  }
}
