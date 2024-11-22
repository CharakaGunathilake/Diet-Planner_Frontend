import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RegisterComponent, FormsModule, NgIf, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private baseUrl: String = "http://localhost:8080/";
  constructor(private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    const currentUser = localStorage.getItem("currentUser");
  }
  protected login = {
    userName: "",
    password: "",
    rememberMe: false
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.checkLogin();
    }
  }

  protected async checkLogin() {
    try {
      if (await this.validLogin(this.login)) {
        localStorage.setItem("rememberedLogin", this.login.rememberMe === true ? JSON.stringify(true) : JSON.stringify(false))
        localStorage.setItem("isLoggedIn", JSON.stringify(true))
        this.router.navigate(["/dashboard/home"]);
        
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("Invalid username or password");
    }
  }

  private reloadPage() {
    window.location.reload();
  }

  private async validLogin(login: any): Promise<boolean> {
    try {
      const data = await this.http.get<boolean>(`${this.baseUrl}login/get-login-byId/${login.userName}/${login.password}`).toPromise();
      if (data != null) {
        localStorage.setItem("currentUserId", JSON.stringify(data));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}

