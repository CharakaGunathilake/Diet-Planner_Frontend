import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private baseUrl: String = "http://localhost:8080/"
  private headers: HttpHeaders | undefined;
  private userId: number | undefined;
  constructor(
    private http: HttpClient
  ) {
    if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
      this.userId = JSON.parse(localStorage.getItem("currentUserId") || "0");
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
    }
  }

  private getDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  getAllQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}quiz/getAll`, { headers: this.headers });
  }

  validLogin(login: any) {
    return this.http.post<any>(`${this.baseUrl}login`, login);
  }

  getUserData(): any {
    return this.http.get(this.baseUrl + "user/byPlanId/" + this.userId, { headers: this.headers })
  }

  getSelectedMeals(): Observable<any[]> {
    //use the the getDate method in production
    return this.http.get<any[]>(`${this.baseUrl}meal-info/mealsById?id=${this.userId}&date=${this.getDate()}`, { headers: this.headers })
  }

  addMealsForDay(mealArray: any[]) {
    mealArray.forEach(mealObj => {
      mealObj.userId = this.userId;
      this.http.post<boolean>(`${this.baseUrl}meal-info/add-meal-info`, mealObj, { headers: this.headers });
    });
  }

  setMealCompleted(mealName: string, timeCompleted: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}meal-Info/mealCompleted?status=${true}&userId=${this.userId}&mealName=${mealName}&timeCompleted=${timeCompleted}`);
  }

  validUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + `login/validate?username=${username}`);
  }

  validEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + `user/validate?email=${email}`);
  }

  deleteCurrentPlan(): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}user/delete-user-byId/${this.userId}`, { headers: this.headers });
  }

  updateLogin(userLogin: any): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}login/update-login`, userLogin, { headers: this.headers });
  }

  updateUser(userDetails: any): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}user/update-user`, userDetails, { headers: this.headers });
  }
}
