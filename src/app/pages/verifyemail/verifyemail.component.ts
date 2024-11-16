import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-verifyemail',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule],
  templateUrl: './verifyemail.component.html',
  styleUrl: './verifyemail.component.css'
})
export class VerifyemailComponent implements AfterViewInit {
  @ViewChild('staticBackdrop') confirmModal!: ElementRef
  login = {
    email: "",
  }
  private baseUrl: String = "http://localhost:8080/";
  protected otp = "";
  protected show = false;
  protected message = "";
  protected title = "";
  protected showSuccess = false;
  protected showFailure = false;
  protected invalidOTP = false;
  protected btnText = "Send OTP";
  protected clicked = false;
  protected seconds = 0;

  constructor(private http: HttpClient) { }
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
      this.timeOut();
      this.verifyEmail();
    }
  }

  timeOut() {
    setInterval(() => {
      this.clicked = false;
    }, 31000)
  }

  verifyEmail() {
    this.http.get<boolean>(`${this.baseUrl}user/verify-email/${this.login.email}`).subscribe((data) => {
      data ? this.show = true : this.show = false;
      if (this.show) {
        this.title = "Email verification";
        this.message = "A verification code has been sent to your email";
        this.openModal();
      } else {
        this.title = "Email verification";
        this.message = "No Email found";
        this.openModal();
      }
    })
  }

  private openModal() {
    const modal = new Modal(this.confirmModal.nativeElement);
    modal.show();
  }

}
