import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtService } from '../../model/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, NgIf, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [JwtService]
})
export class LoginComponent {
  constructor(
    private router: Router,
    private jwtService: JwtService
  ) { }

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
    this.jwtService.validLogin(this.login).subscribe(
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
            console.log(data);
            
          }
          localStorage.setItem("currentUserId", JSON.stringify(data.loginId));
          this.router.navigate(["dashboard/home"]);
        },
        error: (error) => {
          console.log(error.error.message);
        }
      }
    )
  }

}

