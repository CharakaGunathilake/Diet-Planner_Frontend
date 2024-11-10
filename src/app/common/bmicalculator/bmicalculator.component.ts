import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bmicalculator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bmicalculator.component.html',
  styleUrl: './bmicalculator.component.css'
})
export class BmicalculatorComponent {
  unitHeight = "cm";
  unitWeight = "kg";
  @Input() weight = 0;
  @Input() height = 0;
  protected bmi = "0";
  protected bmiStatus = "";
  protected weightRange = "";
  protected color = "";

  calculateBMI() {
    let height = this.height / 100;
    let bmi = (this.weight / (height * height));
    this.bmi = bmi.toFixed(2);
    this.setBmiStatus(bmi);
    this.calculateWeightRange(height);
    localStorage.setItem("BMI",`${this.bmi}`);
  }
  setBmiStatus(bmi: number) {
    if (bmi > 0 && bmi < 18.5) {
      this.color = "danger";  
      this.bmiStatus = "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      this.color = "success";
      this.bmiStatus = "Normal";
    } else if (bmi >= 25 && bmi < 30) {
      this.color = "warning";
      this.bmiStatus = "Overweight";
    } else if (bmi >= 30) {
      this.color = "danger";
      this.bmiStatus = "Obese";
    } else {
      this.color = "secondary";
      this.bmiStatus = "Invalid BMI";
    }
  }

  calculateWeightRange(heightInMeters: number) {
    const minBMI = 18.5;
    const maxBMI = 24.9;
    const minWeight = minBMI * (heightInMeters ** 2);
    const maxWeight = maxBMI * (heightInMeters ** 2);
    this.weightRange = (`Healthy range: ${minWeight.toFixed(2)} kg - ${maxWeight.toFixed(2)} kg`);
  }

}
