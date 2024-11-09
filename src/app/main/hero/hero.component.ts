import { Component, Input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../pages/register/register.component';
import { ModalComponent } from '../../pages/modal/modal.component';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink,RegisterComponent, ModalComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}