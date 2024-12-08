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
      this.userId = JSON.parse(sessionStorage.getItem("currentUserId") || "0");
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

  validLogin(login: any) {
    return this.http.post<any>(`${this.baseUrl}login`, login);
  }

  getUserData(): any {
    return this.http.get(this.baseUrl + "user/byPlanId/" + 8, { headers: this.headers })
  }

  getSelectedMeals(): Observable<any[]> {
    //use the the getDate method in production
    return this.http.get<any[]>(`${this.baseUrl}meal-info/mealsById?id=${5}&date=${"2024-11-22"}`, { headers: this.headers })
  }

  addMealsForDay(mealArray: any[]) {
    mealArray.forEach(mealObj => {
      mealObj.userId = this.userId;
      this.http.post<boolean>(`${this.baseUrl}meal-info/add-meal-info`, mealObj, { headers: this.headers });
    });
  }

  setMealCompleted(mealName: string, timeCompleted: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}meal-Info/mealCompleted?status=${true}&userId=${5}&mealName=${mealName}&timeCompleted=${timeCompleted}`);
  }
}
