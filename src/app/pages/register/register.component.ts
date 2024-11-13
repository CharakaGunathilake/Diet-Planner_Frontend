import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  private baseUrl: String = "http://localhost:8080/";
  private header = { "Content-Type": "application/json" };

  constructor(private router: Router, private http: HttpClient) { }
  @Input() data: any;
  ngOnInit() {

  }
  protected passwordNew: string = "";
  protected passwordConfirm: string = "";
  protected expression: boolean = false;

  protected userObj: any = {
    firstName: "",
    lastName: "",
    gender: "",
    birthDay: Date,
    age: 0,
    height: 0,
    weight: 0,
    email: "",
    status: Boolean,
    regDate: Date,
  }

  protected login: any = {
    username: "",
    password: "",
    Date
  }
  protected async showData(): Promise<void> {
    if (this.matchingPassword()) {
      if (await this.checkUserName(this.login.username)) {
        console.log("Username already taken");
      } else {
        await this.saveUser();
        localStorage.setItem("currentUser", `${this.login.username}`);
        localStorage.setItem("isloggedIn", JSON.stringify(true));
      }
    } else {
      console.log("Password fields doesn't match")
    }
  }
  async saveUser() {
    this.userObj.age = this.data.age;
    this.userObj.birthDay = this.data.birthDay;
    const requestBody = {
      user: this.userObj,
      dietaryInfo: this.data,
      login: this.login
    }

    this.http.post(`${this.baseUrl}user/add-user-with-plan`, requestBody, { headers: this.header }).subscribe((data) => {
      console.log(data);
    });
    // try {
    //   const response = await fetch(this.baseUrl + "user/add-user-with-plan", {
    //     method: "POST",
    //     headers: this.header,
    //     body: JSON.stringify({
    //       })
    //   });
    //   if (!response.ok) {
    //     console.error("Failed to save dietary info:", response.statusText);
    //     return false;
    //   }
    //   const body = await response.json();
    //   return body.success === true;

    // } catch (error) {
    //   console.error("Error saving dietary info:", error);
    //   return false;
    // }
  }

  private async checkUserName(username: String): Promise<boolean> {
    let response = await fetch(this.baseUrl + "login/check-username/" + `${username}`);
    return await response.json();
  }

  private matchingPassword(): boolean {
    console.log(this.passwordNew, this.passwordConfirm);
    if (this.passwordNew === this.passwordConfirm) {
      this.login.password = this.passwordConfirm;
      return true;
    } return false;
  }



}


