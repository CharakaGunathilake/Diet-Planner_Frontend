import { Component, Input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegisterComponent } from '../../pages/register/register.component';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink,RegisterComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}