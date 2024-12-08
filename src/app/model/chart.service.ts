import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

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

  createNutritionChart(): any {
    //fat,carbohydrate,protein,sugar,cholesterol,fiber,vitamin A,Vitamin B2,Vitamin C,Calcium,Iron
    const data = {
      labels: [
        'Carbohydrate',
        'Protein',
        'Calcium',
        'Minerals',
        'Vitamin'
      ],
      datasets: [{
        label: 'kcal',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)',
        ]
      }]
    };

    return {
      type: 'polarArea',
      data: data,
      options: {
        mainAspectRation: false,
        responsive: true,
      },
    };
  }

  weeklyWeightChart(): any {
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
    return {
      type: 'line',
      data: data,
    };
  }
  weeklyStressChart(): ChartConfiguration<'line'> {
    const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const data = {
      labels: labels,
      datasets: [{
        label: 'Stress',
        data: [26, 39, 60, 21],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    return {
      type: 'line',
      data: data,
    };
  }
  dailyWaterProgressChart(): any {
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
    return {
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
  }
  createCaloricChart(): any {
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
    return {
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
  }
  createMealHourChart(): any {
    const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Breakfast',
          data: [8, 9, 8.5, 7],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Lunch',
          data: [13, 12, 15, 0],
          fill: false,
          borderColor: 'rgba(255, 159, 64)',
          tension: 0.1
        },
        {
          label: 'Snack',
          data: [18, 17, 16.8, 16],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 1
        },
        {
          label: 'Dinner',
          data: [21, 20, 22, 21],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
      ]
    };
    return {
      type: 'line',
      data: data,
    };
  }
}
