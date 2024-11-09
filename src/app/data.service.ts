import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSource = new BehaviorSubject<{ userObject:String } | null>(null);
  currentData = this.dataSource.asObservable();

  updateData(data: { userObject: String}) {
    this.dataSource.next(data);
  }
  constructor() { }
}
