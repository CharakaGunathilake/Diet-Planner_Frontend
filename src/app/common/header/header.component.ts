import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../../pages/login/login.component';
import { Modal } from 'bootstrap';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginComponent, NgClass, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @ViewChild('staticBackdrop') loginModal!: ElementRef;
  @Output() action = new EventEmitter<void>();

  private rememberedLogin: boolean = false;
  private isLoggedIn: boolean = false;
  public selectedHeader = 'Home';
  protected dashboard: String = "";
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.dashboard = "Log In";
    this.alreadyLoggedIn();
  }

  protected handleClickEvent(btnIndex: number): void {
    switch (btnIndex) {
      case 1: {
        this.changeSelectedHeader('Home');
        this.updateLoginStatus();
      } break;
      case 2: {
        this.changeSelectedHeader('Dashboard');
        this.navigateToDashboard();
      } break;
      case 3: {
        this.changeSelectedHeader('About');
        this.updateLoginStatus();
      } break;
    }
  }

  public changeSelectedHeader(menuName: string) {
    this.selectedHeader = menuName;
  }

  protected navigateToDashboard() {
    this.alreadyLoggedIn();
    if (localStorage.getItem("token") != null || sessionStorage.getItem("token") != null) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.emitEvent();
    }
  }

  emitEvent() {
    this.action.emit();
  }

  protected updateLoginStatus() {
    this.isLoggedIn = this.rememberedLogin === false ? false : true;
    this.alreadyLoggedIn();
  }

  private alreadyLoggedIn() {
    this.rememberedLogin = JSON.parse(localStorage.getItem("rememberedLogin") || "false");
    this.isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn") || "false");
    console.log(this.rememberedLogin + " this " + this.isLoggedIn);
    this.isLoggedIn === true || this.rememberedLogin === true ? this.dashboard = "Dashboard" : this.dashboard = "Log In";
  }
}
