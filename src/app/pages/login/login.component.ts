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
  }
  protected login = {
    username: "",
    password: "",
    rememberMe: false
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.checkLogin();
    }
  }

  protected checkLogin() {
    this.validLogin(this.login).subscribe(
      {
        next: (data) => {
          console.log(data);
          if (data.jwt == null) {
            console.log(data.message);
            return;
          }
          if (this.login.rememberMe) {
            localStorage.setItem("token", data.jwt);
          } else {
            sessionStorage.setItem("token", data.jwt);
          }
          localStorage.setItem("currentUserId", JSON.stringify(data.id));
          this.router.navigate(["dashboard"]);
        },
        error: (error) => {
          console.log(error.error.message);
        }
      }
    )
  }

  private validLogin(login: any) {
    console.log(login);
    return this.http.post<any>(`${this.baseUrl}login`, login);
  }
}

