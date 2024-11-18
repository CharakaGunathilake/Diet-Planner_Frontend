import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../pages/register/register.component';
import { ModalComponent } from '../../pages/modal/modal.component';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, RegisterComponent, ModalComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  @Output() action = new EventEmitter<void>()

  constructor(private router:Router){}
  handleClick() {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn") || "false")
    const isRememberedLogin = JSON.parse(localStorage.getItem("rememberedLogin") || "false")
    console.log(isRememberedLogin);
    
    if (isLoggedIn || isRememberedLogin) {
      this.router.navigate(["/dashboard/home"]);
    } else {
      this.emitEvent();
    }
  }

  emitEvent() {
    this.action.emit();
  }


}