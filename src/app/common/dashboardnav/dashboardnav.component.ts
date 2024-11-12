import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
let texts = document.getElementById("btnText") as HTMLElement;

@Component({
  selector: 'app-dashboardnav',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  templateUrl: './dashboardnav.component.html',
  styleUrl: './dashboardnav.component.css'
})
export class DashboardnavComponent implements OnInit{
  progress: String = '';
  screenWidth: number = window.innerWidth;
  ngOnInit() {
    // Initialize any logic that depends on the initial screen size
    this.onResize();
    initFlowbite();

  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.screenWidth = window.innerWidth;
    console.log(`Screen width: ${this.screenWidth}`);
    
    // Call any other methods based on screen size here
    this.handleResponsiveLogic();
  }
  
  handleResponsiveLogic(): void {
    if (this.screenWidth < 768) {
      console.log('Screen width is less than 768px, applying mobile layout');
      // Execute logic for mobile screens
      this.progress = '';
    } else {
      console.log('Screen width is 768px or greater, applying desktop layout');
      // Execute logic for desktop screens
      this.progress = 'Progress';
    }
  }
}

