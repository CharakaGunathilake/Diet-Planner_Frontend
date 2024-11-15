import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-verifyemail',
  standalone: true,
  imports: [FormsModule,NgIf,],
  templateUrl: './verifyemail.component.html',
  styleUrl: './verifyemail.component.css'
})
export class VerifyemailComponent {
  protected email = "";
  protected otp = "";
  protected show = false;
  protected message = "";
  protected title = "";
  protected showSuccess = false;
  protected showFailure = false;
  protected invalidOTP = false;
  protected btnText = "Verify";
  

  onSubmit(form: NgForm) {
    this.verifyEmail();
  }
  verifyEmail() {
    throw new Error('Method not implemented.');
  }

}
