import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Modal } from 'bootstrap';
import { initFlowbite } from 'flowbite';
let texts = document.getElementById("btnText") as HTMLElement;

@Component({
  selector: 'app-dashboardnav',
  standalone: true,
  imports: [RouterLink,RouterOutlet, NgIf],
  templateUrl: './dashboardnav.component.html',
  styleUrl: './dashboardnav.component.css'
})
export class DashboardnavComponent implements OnInit{
  @Output() action = new EventEmitter<void>();
  screenWidth: number = window.innerWidth;
  smallSideBar: boolean = false;
  ngOnInit() {
    this.onResize();
    initFlowbite();

  }

  emitEvent() {
    console.log("happen emit");
    this.action.emit();
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
      this.smallSideBar = true;
    } else {
      this.smallSideBar = false;
    }
  }
}

