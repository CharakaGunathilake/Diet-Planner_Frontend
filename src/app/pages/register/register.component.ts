import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, HttpClientModule, ReactiveFormsModule, ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  private baseUrl: String = "http://localhost:8080/";
  private header = { "Content-Type": "application/json" };
  registerForm: FormGroup;
  constructor(private router: Router, private http: HttpClient, private fb:FormBuilder) { 
    this.registerForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  @Input() data: any;
  ngOnInit() {

  }
  protected passwordNew: string = "";
  protected passwordConfirm: string = "";
  protected expression: boolean = false;
  protected responseObj: any = [];
  protected invalidUsername = false;
  protected validateUsername = "";
  protected invalidPassword = false;
  protected validatePassword = "";
  protected invalidName = false;
  protected validateName = "";

  protected userObj: any = {
    firstName: "",
    lastName: "",
    gender: "",
    birthDay: Date,
    age: 0,
    height: 0,
    weight: 0,
    email: "",
    status: false,
    regDate: new Date(),
  }

  protected login: any = {
    username: "",
    password: "",
    loginDate: new Date()
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.showData();
    }
  }

  protected async showData(): Promise<void> {
    if (this.isEmptyNameFields()) {
      if (this.matchingPassword()) {
        if (await this.checkUserName(this.login.username)) {
          this.validateUsername = "Username already taken!";
          this.invalidUsername = true;
        } else {
          await this.saveUser();
          localStorage.setItem("currentUser", `${this.login.username}`);
          localStorage.setItem("isloggedIn", JSON.stringify(true));
        }
      } else {
        this.validatePassword = "Password fields doesn't match";
        this.invalidPassword = true;
      }
    }
  }
  async saveUser() {
    this.userObj.gender = this.data.at(0).gender;
    this.userObj.age = this.data.at(0).age;
    this.userObj.birthDay = this.data.at(0).birthDay;
    this.userObj.status = true;
    this.userObj.height = this.data.at(0).height;
    this.userObj.weight = this.data.at(0).weight;
    const requestBody = {
      user: this.userObj,
      login: this.login,
      dietaryInfo: this.data[0],
      dietPlan: this.data[1]
    }
    this.http.post(`${this.baseUrl}user/add-user-with-plan`, requestBody, { headers: this.header }).subscribe((data) => {
      console.log(data);
    });
  }

  private async checkUserName(username: String): Promise<boolean> {
    let response = await fetch(this.baseUrl + "login/check-username/" + `${username}`);
    return await response.json();
  }

  private matchingPassword(): boolean {
    if (this.passwordNew === "") {
      this.validatePassword = "Password can't be empty!";
      this.invalidPassword = true;
      if (this.passwordNew === this.passwordConfirm) {
        this.login.password = this.passwordConfirm;
        return true;
      } return false;
    } return false;
  }

  private isEmptyNameFields(): boolean {
    if (this.userObj.firstName == "" || this.userObj == "") {
      this.validateName = "Name can't be empty!";
      this.invalidName = true;
      return false;
    } else {
      return true;
    }
  }

}


