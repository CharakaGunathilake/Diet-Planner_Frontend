import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import emailjs from 'emailjs-com';
import { JwtService } from '../../model/jwt.service';


@Component({
  selector: 'app-verifyemail',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule],
  templateUrl: './verifyemail.component.html',
  styleUrl: './verifyemail.component.css',
  providers: [JwtService]
})
export class VerifyemailComponent implements AfterViewInit {
  @ViewChild('staticBackdrop') confirmModal!: ElementRef
  login = {
    email: "",
    username: "Famous",
    otp: 0
  }


  private otpCode: number = 0;
  protected show = false;
  protected message = "";
  protected title = "";
  protected showSuccess = false;
  protected showFailure = false;
  protected invalidOTP = false;
  protected btnText = "Send OTP";
  protected clicked = false;
  protected seconds = 0;

  constructor(
    private router: Router,
    private jwtService: JwtService
  ) { }
  ngAfterViewInit(): void {
    setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        this.clicked = false;
      }
    }, 1000)
  }

  handleSubmit() {
    if (!this.clicked) {
      this.seconds = 30;
      this.clicked = true;
      this.verifyEmail();
    }else{
      this.clicked = false;
    }
  }


  verifyEmail() {
    this.jwtService.validEmail(this.login.email).subscribe((data) => {
      data ? this.show = true : this.show = false;
      if (this.show) {
        this.title = "Email verification";
        this.message = "A verification code has been sent to your email";
        this.otpCode = this.generateCode();
        this.sendEmail(this.login.email, this.otpCode, this.login.username);
        this.openModal();
      } else {
        this.title = "Email verification";
        this.message = "No Email found";
        this.openModal();
      }
    })
  }
  generateCode(): number {
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log(code);
    
    return code;
  }

  private openModal() {
    const modal = new Modal(this.confirmModal.nativeElement);
    modal.show();
  }

  confirmOTP() {
    console.log(this.login.otp);    
    if (this.login.otp === this.otpCode) {
      this.showSuccess = true;
      this.showFailure = false;
      this.invalidOTP = false;
      this.router.navigate(["/"]);
      alert("email verified login to continue.")
    } else {
      this.showSuccess = false;
      this.invalidOTP = true;
    }
  }

  async sendEmail(receivingEmail: string, otp: number, username: string) {
    const serviceId = "service_1m7nnv4"; // Replace with your EmailJS service ID
    const templateId = "template_izcff2p"; // Replace with your EmailJS template ID
    const userId = "WFljdo7b2Al4obW-d"; // Replace with your EmailJS public key

    const templateParams = {
      recieving_email: receivingEmail,
      otp: otp,
      username: username,
    };

    try {
      const response = await emailjs.send(serviceId, templateId, templateParams, userId);
      console.log('Email sent successfully:', response.status, response.text);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

}

