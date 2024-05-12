import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { Title } from '@angular/platform-browser';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CouchService } from 'src/app/services/couch.service';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],

})
export class SignupComponent implements OnInit {

  userName: string = "";
  phoneNumber: string = "";
  password: string = "";
  addItemForm!: FormGroup;
  showError: boolean = false;
  showErrorPhnNO: boolean = false;
  showErrorUserName: boolean = false;
  isScanContainer: boolean = false;

  constructor(
    private couchService: CouchService,
    private title: Title,
    private toastService: ToastService,
    private fb: FormBuilder,
    private router: Router) {
  }

  toggleScanContainer() {
    this.isScanContainer = !this.isScanContainer;
  }

  changeUpper() {
    this.userName = this.userName.toLowerCase();
  }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | Signup");
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('chat');
    }
    this.addItemForm = this.fb.group({
      userName: [''],
      phoneNumber: [''],
      password: [''],
      nickname: '',
    });
  }

  navigate() {
    this.router.navigateByUrl('/login');
  }

  onSubmit() {

    const customId = 'user_2_' + uuidv4();

    this.addItemForm.value._id = customId;
    this.addItemForm.value.userName = this.userName;
    this.addItemForm.value.phoneNumber = this.phoneNumber;
    this.addItemForm.value.password = this.password;

    const encryptedPassword = CryptoJS.AES.encrypt(this.password, 'secret key').toString();

    const couchFormat = {
      _id: 'user_2_' + uuidv4(),
      data: {
        userName: this.userName,
        phoneNumber: this.phoneNumber,
        password: encryptedPassword,
        nickname: null,
        age: null,
        gender: null,
        dob: null,
        groups: [],
        type: "user"
      }
    }

    this.couchService.createAccount(couchFormat).subscribe(res => {

    });

    localStorage.setItem('token', this.phoneNumber);
    this.router.navigateByUrl("chat");
  }

  checkUserExistence() {
    const phoneNumber = this.phoneNumber;
    this.couchService.checkExistingUser(phoneNumber).subscribe((response: any) => {

      if (response.rows.length != 0) {
        this.toastService.showToast('Phone Number Already used', true);
  

      } else {
        this.onSubmit();
      }
    });
  }


  validation() {
    this.showErrorUserName = false;
    this.showErrorPhnNO = false;
    this.showError = false;

    const phoneNumberPattern = /^[0-9]{10}$/;
    const hasNumbersOrSymbols = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(this.password);
    const hasNumbersOrSymbolsForUserName = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(this.userName);

    if (!this.userName) {
      this.showErrorUserName = true;
    } else if (hasNumbersOrSymbolsForUserName) {
      this.showErrorUserName = true;
      this.toastService.showToast('Symbols & Numbers Not Allowed for UserName', true);
    } else if (this.userName && this.userName.length < 4) {
      this.showErrorUserName = true;
      this.toastService.showToast('( User Name ) Need Atleast 4 charecters', true);
    } else if (!this.phoneNumber) {
      this.showErrorPhnNO = true;
    } else if (!phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorPhnNO = true;
      this.toastService.showToast('Invalid Phone Number', true);
    } else if (!this.password) {
      this.showError = true;
    } else if (this.password.length < 8) {
      this.showError = true;
      this.toastService.showToast('( Password ) Need Atleast 8 characters', true);
    } else if (hasNumbersOrSymbols) {
      this.showError = true;
      this.toastService.showToast('Symbols & Numbers Not Allowed', true);
    } else if (this.userName && this.phoneNumber && this.password && phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorUserName = false;
      this.showErrorPhnNO = false;
      this.showError = false;
      this.checkUserExistence();
    }
  }


}
