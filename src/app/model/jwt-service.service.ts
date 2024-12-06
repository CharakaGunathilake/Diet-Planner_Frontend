import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtServiceService {
  private baseUrl: String = "http://localhost:8080/"
  private userDetails: any = {};
  private headers: HttpHeaders | undefined;
  private userId: number | undefined;
  constructor(
    private http: HttpClient
  ) {
    if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
      this.userId = JSON.parse(sessionStorage.getItem("currentUserId") || "0");
      this.getUserData(this.userId || 0);
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
    }
  }
  private getUserData(id: number) {
    this.http.get(this.baseUrl + "user/byPlanId/" + 6, { headers: this.headers }).subscribe((data) => {
      console.log(data);
      this.userDetails = data;
    })
  }

  addMealsForDay(mealArray: any[]) {
    mealArray.forEach(mealObj => {
      mealObj.userId = this.userId;
      this.http.post<boolean>(`${this.baseUrl}meal-info/add-meal-info`, mealObj, { headers: this.headers });
    });
  }

  setMealCompleted(mealName: string, timeCompleted: string): boolean {
    let bool = false;
    this.http.get<boolean>(`${this.baseUrl}meal-Info/mealCompleted?status=${true}&userId=${this.userId}&mealName=${mealName}&timeCompleted=${timeCompleted}`).subscribe((data) => {
      bool = data
    });
    return bool;
  }

  getSelectedMeals(date: String): any[] {
    let selectedMeals: any[] = [];
    this.http.get<any[]>(`${this.baseUrl}meal-info/mealsById?userId=${this.userId}&date=${date}`, { headers: this.headers }).subscribe(
      (data) => {
       selectedMeals = data;
      }
    );
    return selectedMeals;
  }

  public getUserDetails() {
    return this.userDetails;
  }
}
