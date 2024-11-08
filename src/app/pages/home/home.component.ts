import { Component } from '@angular/core';
import { HeroComponent } from '../../main/hero/hero.component';
import { HeaderComponent } from '../../common/header/header.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { FeatureComponent } from '../../main/feature/feature.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,HeroComponent,FooterComponent,FeatureComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
