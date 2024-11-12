import { Component, Input, OnInit } from '@angular/core';
import { DietaryinfoserviceService } from '../../dietaryinfoservice.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  @Input() userResponseObject: any = [];

  ngOnInit() {
  }
 
  showData() {
    console.log(this.userResponseObject);
  }
  private async saveUser(): Promise<void> {
    // this.userService.addUserWithPlan(this.initObject()).subscribe(response => {
    //   console.log('User added successfully:', response);
    // }, error => {
    //   console.error('Error adding user:', error);
    // });
  }

 
}
