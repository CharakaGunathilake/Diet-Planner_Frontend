import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RegisterComponent, FormsModule,NgIf,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private baseUrl: String = "http://localhost:8080/";
  protected rememberMe: boolean = false;
  private loginObj: any;
  constructor(private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    const currentUser = localStorage.getItem("currentUser");
    console.log(currentUser);
  }
  protected login = {
    userName: "",
    password: ""
  }

  onSubmit(form: NgForm) {
    this.checkLogin();
  }

  protected async checkLogin() {
    if (await this.validLogin(this.login)) {
      localStorage.setItem("rememberedLogin", this.rememberMe === true ? JSON.stringify(true) : JSON.stringify(false))
      localStorage.setItem("isloggedIn",JSON.stringify(true))
      this.router.navigate(["/dashboard/home"])
    } else {
      alert("Invalid username or password");
    }
  }
  private async validLogin(login: any): Promise<boolean> {
    console.log(login);
    // let response = await fetch(this.baseUrl + "login/get-login-byId/" + `${login.userName}`);
    // let body = await response.json();
    // this.loginObj = body;
    this.http.get<any[]>(`${this.baseUrl}login/get-login-byId/${login.userName}`).subscribe((data) => {
      console.log(data);
      
      this.loginObj = data;
    });
    return this.loginObj.username === login.userName && this.loginObj.password === login.password;
  }
}

