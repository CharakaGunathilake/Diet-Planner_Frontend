import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent implements OnInit {
  weightChart: any;
  waterChart: any;
  caloricChart: any;
  ngOnInit(): void {
    this.createWeightChart();
    this.createWaterChart();
    this.createCaloricChart();
  }
  createWeightChart(): void {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const data = {
      labels: labels,
      datasets: [{
        label: 'Weight',
        data: [65, 59, 80, 81],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    const config: any = {
      type: 'line',
      data: data,
    };
    this.weightChart = new Chart("weightChart", config);
  }
  createWaterChart(): void {
    const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const data = {
      labels: labels,
      datasets: [{
        label: 'Water',
        data: [6, 9, 8, 8, 5, 5, 4],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235)',
        ],
        borderWidth: 1
      }]
    };
    const config: any = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };
    this.waterChart = new Chart("waterChart", config);
  }
  createCaloricChart(): void {
    const labels = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const data = {
      labels: labels,
      datasets: [{
        label: 'Calories',
        data: [6, 9, 8, 8, 5, 5, 4],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 159, 64)',
        ],
        borderWidth: 1
      }]
    };
    const config: any = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };
    this.caloricChart = new Chart("caloricChart", config);
  }

}