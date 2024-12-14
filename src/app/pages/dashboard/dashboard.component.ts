import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { DashboardnavComponent } from '../../common/dashboardnav/dashboardnav.component';
import { DashboardHomeComponent } from '../dashboard-components/dashboard-home/dashboard-home.component';
import { Router, RouterOutlet } from '@angular/router';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, DashboardnavComponent, DashboardHomeComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  @ViewChild("staticBackDrop") logoutModal!: ElementRef;
  handleAction() {
    this.openModal();
  }
  constructor(private router: Router) { }
  ngOnInit(): void {
    // localStorage.setItem("isSelecting", JSON.stringify(true));
  }

  openModal() {
    const modal = new Modal(this.logoutModal.nativeElement);
    modal.show();
  }

  logOut() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    this.router.navigate(["/"]);
  }
}