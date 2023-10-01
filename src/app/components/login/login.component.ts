import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastService } from 'src/app/services/toast.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  phoneNumber!: any;
  password!: any;
  users!: any[];
  showError: boolean = false;
  showErrorPhnNO: boolean = false;

  constructor(private title: Title, private toastService: ToastService, public router: Router, private firebase: FirebaseService) { }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | Login");
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('chat');
    }
  }

  navigate() {
    this.password = "";
    this.router.navigateByUrl('/signup');
  }

  login() {
    this.firebase.login(this.phoneNumber).subscribe((users: any[]) => {
      if (users.length === 1) {
        const user = users[0];
        if (user.password === this.password) {
          this.password = "";
          this.toastService.showToast('Login successful', true);
          localStorage.setItem('token', this.phoneNumber);
          this.clearData();
          this.router.navigateByUrl('chat');

        } else {
          this.password = "";
          console.log('Incorrect password');
          this.toastService.showToast('Incorrect password', false);
          this.showError = true;
        }
      } else {
        console.log('User not found');
        this.toastService.showToast('User not found', false);
        this.clearData();
      }
    });
  }

  clearData() {
    this.phoneNumber = "";
    this.password = "";
  }

  validation() {
    // Reset error flags initially
    this.showErrorPhnNO = false;
    this.showError = false;

    // Define a regular expression pattern for 10 digits
    const phoneNumberPattern = /^[0-9]{10}$/;

    if (this.phoneNumber == null || !phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorPhnNO = true;
    }

    if (!this.password) {
      this.showError = true;
    }

    if (this.phoneNumber && this.password && phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorPhnNO = false;
      this.showError = false;
      this.login();
    }
  }


}
