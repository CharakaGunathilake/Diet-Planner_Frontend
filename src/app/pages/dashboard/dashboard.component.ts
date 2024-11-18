import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { DashboardnavComponent } from '../../common/dashboardnav/dashboardnav.component';
import { DashboardHomeComponent } from '../dashboard-components/dashboard-home/dashboard-home.component';
import { Router, RouterOutlet } from '@angular/router';
import { MealsComponent } from '../dashboard-components/meals/meals.component';
import { ProgressComponent } from '../dashboard-components/progress/progress.component';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,DashboardnavComponent,DashboardHomeComponent,RouterOutlet,MealsComponent,ProgressComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild("staticBackDrop") logoutModal!:ElementRef;
  handleAction(){
    this.openModal();
  }

  constructor(private router:Router){}

  openModal(){
    const modal = new Modal(this.logoutModal.nativeElement);
    modal.show();
  }
  
  private reloadPage() {
    window.location.reload();
  }

  logOut(){
    localStorage.setItem("rememberedLogin",JSON.stringify(false));
    localStorage.setItem("isLoggedIn",JSON.stringify(false));
    this.reloadPage();
    this.router.navigate(["/"]);
  }
}