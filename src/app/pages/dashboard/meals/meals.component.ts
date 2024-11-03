import { Component, OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css'
})
export class MealsComponent implements OnInit {
  public chart:any;

  ngOnInit(): void {
    this.createChart();
  }

  createChart():void {
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
  
    const config:any = {
      type: 'polarArea',
      data: data,
      options: {
      },
    };
  
    this.chart = new Chart("nutritionChart",config);
  }
}

