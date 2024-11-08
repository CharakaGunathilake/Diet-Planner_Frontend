import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../../pages/login/login.component';
import { Modal } from 'bootstrap';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginComponent, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @ViewChild('staticBackdrop1') loginModal!: ElementRef;
  private rememberedLogin: boolean = false;
  private isLoggedIn: boolean = JSON.parse(localStorage.getItem("isLoggedIn") || "false");
  ngOnInit(): void {
    this.dashboard = "Log In";
    this.rememberedLogin = JSON.parse(localStorage.getItem("rememberedLogin") || "false");
    console.log(this.rememberedLogin);
    console.log(this.isLoggedIn);
    this.alreadyLoggedIn();
  }

  public selectedHeader = 'Home';

  protected handleClickEvent(btnIndex: number): void {
    switch (btnIndex) {
      case 1: {
        this.changeSelectedHeader('Home');
        this.updateLoginStatus();
      }break;
      case 2: {
        this.changeSelectedHeader('Dashboard');
        this.navigateToDashboard();
      }break;
      case 3: {
        this.changeSelectedHeader('About');
      }break;
    }
  }

  public changeSelectedHeader(menuName: string) {
    this.selectedHeader = menuName;
  }

  protected dashboard: String = "Log In";
  constructor(private router: Router) { }
  protected navigateToDashboard() {
    if (this.rememberedLogin || this.isLoggedIn) {
      this.router.navigate(["/dashboard/home"]);
    } else {
      this.openModal();
    }
  }
  private openModal() {
    const modal = new Modal(this.loginModal.nativeElement);
    modal.show();
  }

  protected updateLoginStatus() {
    this.isLoggedIn = this.rememberedLogin === false ? false : true;
    this.alreadyLoggedIn();
  }

  private alreadyLoggedIn() {
    this.isLoggedIn === true || this.rememberedLogin === true ? this.dashboard = "Dashboard" : this.dashboard = "Log In";
  }
}
