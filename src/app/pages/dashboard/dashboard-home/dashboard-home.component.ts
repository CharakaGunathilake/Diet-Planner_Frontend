import { Component } from '@angular/core';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  public labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  public data = {
    labels: this.labels,
    datasets: [
      {
        label: 'Achieved',
        data: [1600, 1000, 1600, 1810, 1500, 1350, 1200],
        backgroundColor: [
          'rgba(20, 224, 17, 0.733)',
        ],
        borderColor: [
          'rgba(20, 224, 17)',
        ],
        borderWidth: 1
      },
      {
        label: 'Target Calories',
        data: [250, 1590, 1800, 1810, 1560, 1550, 1400],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1
      }
    ]
  };
  
  options1 = {
    responsive: true,
    aspectRatio: 2,
    scales: {
      x: {
        stacked: true // Enable stacking on x-axis
      },
      y: {
        beginAtZero: true,
        stacked: true // Enable stacking on y-axis
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  public config1: any = {
    type: 'bar',
    data: this.data,
    options: this.options1,
  };
  chart1: any;

  data2 = {
    labels: ['Water Taken', 'Target'], // Labels for each section
    datasets: [{
      label: 'Glasses',
      data: [2, 10], // Values for each section
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)'

      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1
    }]
  };

  

  options = {
    responsive: true,
    mainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      }
    },
    cutout: '70%' // Controls the thickness of the doughnut
  };

  chart2: any;
  image = new Image();
  public config2:any = {
    type: 'doughnut',
    data: this.data2,
    plugins: [{
      id: 'customCanvasBackgroundImage',
      beforeDraw: (chart2: { ctx: any; chartArea: { top: any; left: any; width: any; height: any; }; draw: () => any; }) => {
        if (this.image.complete) {
          const ctx = chart2.ctx;
          const {top, left, width, height} = chart2.chartArea;
          const x = left + width / 2 - this.image.width / 2;
          const y = top + height / 2 - this.image.height / 2;
          ctx.drawImage(this.image, x, y);
        } else {
          this.image.onload = () => chart2.draw();
        }
      }
    }],
    options: this.options
  }

  ngOnInit(): void {
    this.chart1 = new Chart("progressChart", this.config1);
    this.chart2 = new Chart("waterChart", this.config2);
    this.image.src = 'icons/water.png';
  }
}
