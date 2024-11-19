import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeroComponent } from './main/hero/hero.component';
import { HeaderComponent } from './common/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { initFlowbite } from 'flowbite';
import { LoginComponent } from './pages/login/login.component';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,HeroComponent,DashboardComponent,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent implements OnInit {
  @ViewChild('staticBackdrop') loginModal!: ElementRef;
  title = 'SmartPlate';

  constructor(private router: Router) {}
  ngOnInit(): void {
    initFlowbite();
    // localStorage.setItem("rememberedLogin",JSON.stringify(false));
    // localStorage.setItem("isLoggedIn",JSON.stringify(false));
    // localStorage.setItem("isSelecting",JSON.stringify(false));
    this.isCurrentUser();
  }
  handleAction() {
    this.openModal();
  }
  
  private isCurrentUser(){
    const currentUserId = localStorage.getItem("currentUserId");
    if(currentUserId != null){
      console.log(currentUserId);
      localStorage.setItem("isLoggedIn",JSON.stringify(true));
    }else{
      localStorage.setItem("isLoggedIn",JSON.stringify(false));
    }
  }

  private openModal() {
    const modal = new Modal(this.loginModal.nativeElement);
    modal.show();
  }
}
  
