import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../main/hero/hero.component';
import { LoginComponent } from '../../pages/login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
