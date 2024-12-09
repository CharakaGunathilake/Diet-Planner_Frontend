import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtService } from '../../model/jwt.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, HttpClientModule, ReactiveFormsModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [JwtService]
})

export class RegisterComponent {
  private baseUrl: String = "http://localhost:8080/";
  private header = { "Content-Type": "application/json" };
  @Output() action = new EventEmitter<void>();

  registerForm: FormGroup;
  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private jwtService: JwtService
  ) {
    this.registerForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3)]],
    });

  }
  @Input() data: any;

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
      if (this.passwordObj.passwordNew == this.passwordObj.passwordConfirm) {
        console.log(this.passwordObj.passwordConfirm);
        //User123@
        this.login.password = this.passwordObj.passwordConfirm;
        return true;
      } else { return false; }
    } { return false; }
  }

  protected async registerUser(): Promise<void> {
    this.uniqueUsername = this.checkUserName(this.login.username);
    this.uniqueEmail = this.checkEmail(this.userObj.email)
    if (this.uniqueUsername && this.uniqueEmail) {
      if (!this.notMatching()) {
        this.invalidPassword = true;
      } else {
        localStorage.setItem("currentUser", `${this.login.username}`);
        localStorage.setItem("isloggedIn", JSON.stringify(true));
        await this.saveUser();
        this.router.navigate(["/verifyemail"])
      }
    } else {
      alert("User already exists");
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
    this.http.post(`${this.baseUrl}user/register-with-plan`, requestBody, { headers: this.header }).subscribe((data) => {
      console.log(data);
    });
  }

  private checkUserName(username: string): boolean {
    this.jwtService.validUsername(username).subscribe((data) => {
      return !data;
    });
    return true;
  }


  private checkEmail(email: string): boolean {
    this.jwtService.validEmail(email).subscribe((data) => {
      return !data;
    })
    return true;
  }

  emitEvent() {
    this.action.emit();
  }
}


