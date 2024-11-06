import { Component, NgModule, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,LoginComponent,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  ngOnInit(): void {
  }
   public firstName: string ="";
    

}
