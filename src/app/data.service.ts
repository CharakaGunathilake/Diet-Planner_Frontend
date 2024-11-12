import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080/';
  private header = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  private userData = new BehaviorSubject<any>(null);

  // Observable that components can subscribe to
  userData$ = this.userData.asObservable();
  responseObj: any;

  // Method to set/update the data
  setUserData(data: any): void {
    this.userData.next(data);
  }

  // Optional: Method to get the current value without subscribing
  getUserData(): any {
    return this.userData.getValue();
  }


  constructor(private http: HttpClient) {}

  addUserResponse(initObject: any){
    this.responseObj = initObject;
    return this.responseObj == null;
  }
  addUserWithPlan(userObj: any, userResponseObject: any, login: any, initObject: any): Observable<any> {
    const requestBody = {
      user: {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        gender: userResponseObject[0],
        birthDay: userResponseObject[1],
        age: initObject.age,
        height: userResponseObject[2],
        weight: userResponseObject[3],
        email: userObj.email,
        status: true,
        regDate: new Date()
      },
      login: {
        username: login.username,
        password: login.password,
        loginDate: new Date()
      },
      initObject
    };

    return this.http.post(`${this.baseUrl}user/add-user-with-plan`, requestBody, { headers: this.header });
  }

}
