import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, HttpClientModule, ReactiveFormsModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  private baseUrl: String = "http://localhost:8080/";
  private header = { "Content-Type": "application/json" };
  registerForm: FormGroup;
  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  @Input() data: any;

  ngOnInit() {

  }
  protected expression: boolean = false;
  protected responseObj: any = [];
  protected uniqueUsername = true;
  protected uniqueEmail = true;
  protected invalidPassword = false;

  protected passwordObj: any = {
    passwordNew: "",
    passwordConfirm: ""
  }

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
      this.registerUser();
    }
  }

  notMatching() {
    if (this.passwordObj.passwordNew != "" || this.passwordObj.passwordConfirm != "") {
      if (this.passwordObj.passwordNew === this.passwordObj.passwordConfirm) {
        this.login.password = this.passwordObj.passwordConfirm;
        return true;
      } return false;
    } return false;
  }

  protected async registerUser(): Promise<void> {
    if (this.checkUserName(this.login.username) && this.checkEmail(this.userObj.email)) {
      if (this.notMatching()) {
        this.invalidPassword = true;
      } else {
        await this.saveUser();
        localStorage.setItem("currentUser", `${this.login.username}`);
        localStorage.setItem("isloggedIn", JSON.stringify(true));
      }
    }alert("User already exists");
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

  private checkUserName(username: String): boolean {
    this.http.get<boolean>(this.baseUrl + "login/check-username/" + `${username}`).subscribe((data) => {
      this.uniqueUsername = !data;
      return !data;
    })
    return false;
  }

  private checkEmail(email: String): boolean {
    this.http.get<boolean>(`${this.baseUrl}user/verify-email/${email}`).subscribe((data) => {
      this.uniqueEmail = !data;
      return !data;
    })
    return false;
  }

}


