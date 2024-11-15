import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bmicalculator',
  standalone: true,
  imports: [FormsModule,NgIf,ReactiveFormsModule],
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
  protected maxHeight = 240;
  protected minHeight = 50;
  protected maxWeight = 250;
  protected minWeight = 20;

  changeUnitWeight() {
    if (this.unitWeight === "kg") {
      this.unitWeight = "lb";
      this.maxWeight = 350;
      this.minWeight = 0;
    } else if (this.unitWeight === "lb") {
      this.unitWeight = "kg";
      this.maxWeight = 150;
      this.minWeight = 20;
    }
  }
  changeUnitHeight() {
    if (this.unitHeight === "cm") {
      this.unitHeight = "ft";
      this.maxHeight = 10;
      this.minHeight = 4;
    } else if (this.unitHeight === "ft") {
      this.unitHeight = "cm";
      this.maxHeight = 240;
      this.minHeight = 50;
    } 
  }
  calculateBMI() {
    let height= 0;
    let weight = 0;
    this.unitHeight === "ft" ? height = this.height * 30.48 : height = this.height;
    this.unitWeight === "lb" ? weight = this.weight * 0.453592 : weight = this.weight;
    console.log(this.unitHeight + "" + height + " and " + weight);
    
    height /= 100;
    let bmi = (weight / (height * height));
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
