import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeroComponent } from './main/hero/hero.component';
import { HeaderComponent } from './common/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { initFlowbite } from 'flowbite';
import { LoginComponent } from './pages/login/login.component';
import { Modal } from 'bootstrap';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeroComponent, DashboardComponent, LoginComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent implements OnInit {
  @ViewChild('staticBackdrop') loginModal!: ElementRef;
  title = 'SmartPlate';
  disable: boolean = false;

  constructor(private router: Router) { }
  ngOnInit(): void {
    initFlowbite();
    // localStorage.clear();
    // sessionStorage.clear();
    // this.isCurrentUser();
  }

  handleAction(index: number) {
    switch (index) {
      case 1:
        this.openModal();
        break;
      case 2:
        this.disable = true;
        break;
    }
  }

  private isCurrentUser() {
    const currentUserId = localStorage.getItem("currentUserId");
    const rememberedLogin = localStorage.getItem("rememberedLogin")
    if (currentUserId != null && rememberedLogin) {
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    } else {
      localStorage.setItem("isLoggedIn", JSON.stringify(false));
      localStorage.setItem("isSelecting", JSON.stringify(true));
      localStorage.setItem("isStarter", JSON.stringify(true));
    }
  }

  private openModal() {
    const modal = new Modal(this.loginModal.nativeElement);
    modal.show();
  }
}

