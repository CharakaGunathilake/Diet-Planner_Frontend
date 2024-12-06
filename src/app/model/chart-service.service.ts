import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {

  constructor() { }

  weeklyCalorieChart(): any {
    const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Achieved',
          data: [1600, 1000, 1600, 1810, 1500, 1350, 1200],
          backgroundColor: [
            'rgba(20, 224, 17, 0.2)',
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
            'rgba(255, 99, 132, 0.1)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
          ],
          borderWidth: 1
        }
      ]
    };
  
    const options = {
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
    return {
      type: 'bar',
      data: data,
      options: options,
    };
  }
  
  dailyWaterIntakerChart(current: number, target: number): any {
     const image = new Image();
     image.src = 'icons/water.png';
    const data = {
      labels: ['Water Taken', 'Target'], // Labels for each section
      datasets: [{
        label: 'Glasses',
        data: [current, target], // Values for each section
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
  
    const options = {
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
  
    const config: any = {
      type: 'doughnut',
      data: data,
      plugins: [{
        id: 'customCanvasBackgroundImage',
        beforeDraw: (chart2: { ctx: any; chartArea: { top: any; left: any; width: any; height: any; }; draw: () => any; }) => {
          if (image.complete) {
            const ctx = chart2.ctx;
            const { top, left, width, height } = chart2.chartArea;
            const x = left + width / 2 - image.width / 2;
            const y = top + height / 2 - image.height / 2;
            ctx.drawImage(image, x, y);
          } else {
            image.onload = () => chart2.draw();
          }
        }
      }],
      options: options
    }
    return config;
  }
  

}
