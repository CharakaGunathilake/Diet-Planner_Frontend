import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterComponent } from '../../pages/register/register.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink,RegisterComponent,RegisterComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}
