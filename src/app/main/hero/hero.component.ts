import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../pages/register/register.component';
import { ModalComponent } from '../../pages/modal/modal.component';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, RegisterComponent, ModalComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  @ViewChild('staticBackdrop') loginModal!: ElementRef;

  showModal(){
    const modal = new Modal(this.loginModal.nativeElement);
    modal.show();
  }
  
}