import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { Title } from '@angular/platform-browser';
import { CouchService } from 'src/app/services/couch.service';
import * as CryptoJS from 'crypto-js';


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
  
  showTip: boolean = false;
  message: string = '';

  constructor( private toastService: ToastService,private title: Title, private couchService: CouchService, public router: Router) { }

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
    this.couchService.checkExistingUser(this.phoneNumber).subscribe((users: any) => {
       
      if (users.rows.length === 1) {

        const decryptedPassword = CryptoJS.AES.decrypt(users.rows[0].value.data.password , 'secret key').toString(CryptoJS.enc.Utf8);

        if ( decryptedPassword === this.password) {
          localStorage.setItem('token', this.phoneNumber);
          this.clearData();
          this.router.navigateByUrl('chat');

        } else {
          this.password = "";
          console.log('Incorrect password');
          this.toastService.showToast('Incorrect password', true);
          this.showError = true;
        }
      } else {
        console.log('User not found');
        this.toastService.showToast('User not found', true);
      }
    });
  }

  clearData() {
    this.phoneNumber = "";
    this.password = "";
  }

  openPhnTip() {
    this.message = 'It must need 10 numbers'
    this.showTip = true;
  }

  validatePhn() {
    const phoneNumberPattern = /^[0-9]{10}$/;

    if (phoneNumberPattern.test(this.phoneNumber)) {
      this.showTip = false;
    } else {
      this.showTip = true;
    }
  }

  closePhnTip() {
    this.showTip = false;
  }

  openPassTip() {
    this.message = 'It must need 10 numbers'
    this.showTip = true;
    console.log(this.showTip);

  }

  closePassTip() {
    this.showTip = false;
    console.log(this.showTip);
  }


  validation() {
    this.showErrorPhnNO = false;
    this.showError = false;

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
