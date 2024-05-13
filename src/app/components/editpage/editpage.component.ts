import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CouchService } from 'src/app/services/couch.service';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-editpage',
  templateUrl: './editpage.component.html',
  styleUrls: ['./editpage.component.css']
})
export class EditpageComponent implements OnInit {
handleKeyPress($event: KeyboardEvent) {
throw new Error('Method not implemented.');
}

  showErrorGender: boolean = false;
  gender: string = '';
  isGenderMale = false;
  isGenderFemale = false;
  selectedDay: string = '';
  selectedMonth: string = '';
  selectedYear: string = '';
  showErrorDob: boolean = false;
  days: string[] = [];
  months: string[] = [];
  years: string[] = [];
  userData: any;
  tempForm!: FormGroup;
  EditedForm!: FormGroup;

  FormAge: string = '';
  FormDob: string = '';
  FormGender: string = '';
  nickname: string = '';
  NewPassword: string = '';
  CurrentPassword: string = '';
  phoneNumber: string = '';
  userName: string = '';

  Edited!: boolean;
  isunsaveDiolog: boolean = false;
  showDobError!: string;
  age: number = 0;
  birthdate: string = '';
  showErrorNickName!: boolean;
  showError: boolean = false;
  password: string = '';
  showErrorPhnNO!: boolean;
  showErrorUserName!: boolean;
  showErrorUserNameMessage!: string;
  showErrorPhnNOMessage!: string;
  showErrorNickNameMessage!: string;
  showErrorMessage!: string;
  passwordDiolog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private couchService: CouchService
  ) {

    this.tempForm = this.fb.group({
      age: [''],
      dob: [''],
      gender: [''],
      nickname: [''],
      password: [''],
      phoneNumber: [''],
      userName: [''],
      type: "user"
    });

    this.EditedForm = this.fb.group({
      age: [''],
      dob: [''],
      gender: [''],
      nickname: [''],
      password: [''],
      phoneNumber: [''],
      userName: [''],
      type: "user"
    });
  }

  compareFormGroups(): void {

    const tempFormValues = this.tempForm.value;
    const editedFormValues = this.EditedForm.value;

    const isEqual = Object.keys(tempFormValues).every((key) => {
      return tempFormValues[key] === editedFormValues[key];
    });

    this.Edited = isEqual;
  }

  ngOnInit(): void {

    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
    }

    for (let i = 1; i <= 31; i++) {
      this.days.push(i.toString());
    }

    this.months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
      this.years.push(i.toString());
    }

    this.tempForm.patchValue(this.userData.data);
    this.EditedForm.patchValue(this.userData.data);

    this.userName = this.EditedForm.value.userName;
    this.nickname = this.EditedForm.value.nickname;
    this.phoneNumber = this.EditedForm.value.phoneNumber;
    this.age = this.EditedForm.value.age;
    this.birthdate = this.EditedForm.value.dob;
    this.FormGender = this.EditedForm.value.gender;


    this.compareFormGroups();
    if (this.FormGender === "male") {
      this.toggleMale()
    } else {
      this.toggleFemale()
    }

  }

  conformPassword() {

    const decryptedPassword = CryptoJS.AES.decrypt(this.userData.data.password, 'secret key').toString(CryptoJS.enc.Utf8);

    if (!this.CurrentPassword) {
      this.showError = true;
    } else if (this.CurrentPassword === decryptedPassword) {
      this.passwordDiolog = false;
      this.CurrentPassword = "";

      const updateFormat = {
        _id: this.userData._id,
        _rev: this.userData._rev,
        data: this.EditedForm.value
      }

      this.couchService.updateUserProfile(this.userData._id, this.userData._rev, updateFormat).subscribe((res) => {
        this.router.navigateByUrl('/chat');
      });

    } else {
      this.showError = true;
      const notificationFormat = {
        _id: "notification_2_" + uuidv4(),
        data: {
          time: String(new Date()),
          message: `Someone tried to Edit your Profile`,
          type: "notification",
          user: this.userData._id
        }
      }
      this.couchService.createNotification(notificationFormat).subscribe((res) => {
      });
      this.toastService.showToast('wrong password', true);
    }
  }

  toggleMale() {
    this.gender = "male";
    this.FormGender = "male";
    this.isGenderFemale = false;
    this.isGenderMale = true;
    this.checkEdit();
  }

  toggleFemale() {
    this.gender = "female";
    this.FormGender = "female";
    this.isGenderMale = false;
    this.isGenderFemale = true;
    this.checkEdit();
  }

  checkEdit() {
    this.changeUpper();
    this.checkDOB();
  }

  calculateAge() {
    this.birthdate = (`${this.selectedDay}/${this.selectedMonth}/${this.selectedYear}`);
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    const ageDiff = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      this.age = ageDiff - 1;
    } else {
      this.age = ageDiff;
    }
  }

  checkDOB() {
    if (this.selectedDay || this.selectedMonth || this.selectedYear) {
      this.Validation();
      if (!this.selectedDay && !this.selectedMonth && !this.selectedYear) {
        console.log('test');
        
      } else if (this.selectedDay && this.selectedMonth && this.selectedYear) {
        this.calculateAge();
        this.EditedForm.value.age = this.age;
        this.EditedForm.value.dob = this.birthdate;
        this.Validation();
      } else {
        this.Edited = true;
      }
    } else {
      this.Validation();
    }
  }

  checkPassword() {
    this.password = this.password.toLowerCase();
    const hasNumbersOrSymbolsforPasswoed = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(this.password);

    if (this.password) {
      this.Edited = true;
      if (hasNumbersOrSymbolsforPasswoed) {
        this.showError = true;
        this.showErrorMessage = 'Symbols & Numbers Not Allowed';
      } else if (this.password.length < 8) {
        this.showError = true;
        this.showErrorMessage = '( Password ) Need Atleast 8 characters';
      } else {
        this.EditedForm.value.password = CryptoJS.AES.encrypt(this.password, 'secret key').toString();
        this.Validation();
      }
    } else {
      this.showError = false;
      this.showErrorMessage = '';
      this.EditedForm.value.password = this.tempForm.value.password;
      this.Validation();
    }
  }

  changeUpper() {
    this.nickname = this.nickname.toLowerCase();
    this.userName = this.userName.toLowerCase();
  }

  Validation() {

    this.Edited = true;

    this.showErrorUserName = false;
    this.showErrorUserNameMessage = '';

    this.showErrorNickName = false;
    this.showErrorNickNameMessage = '';

    this.showErrorPhnNO = false;
    this.showErrorPhnNOMessage = '';

    this.showError = false;
    this.showErrorMessage = '';

    const phoneNumberPattern = /^\d{10}$/;
    
    const hasNumbersOrSymbols = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(this.userName);

    if (!this.userName || this.userName.length < 4) {
      this.showErrorUserName = true;
      this.showErrorUserNameMessage = '( User Name ) Need Atleast 4 charecters';
    } else if (hasNumbersOrSymbols) {
      this.showErrorUserNameMessage = 'Symbols & Numbers Not Allowed';
      this.showErrorUserName = true;
    } else if (!this.phoneNumber || !phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorPhnNO = true;
      this.showErrorPhnNOMessage = 'Invalid Phone Number';
    } else if (!this.nickname || this.nickname.length < 6) {
      this.showErrorNickName = true;
      this.showErrorNickNameMessage = '( nickname ) Need Atleast 6 charecters';
    } 
    else if (this.checkExistingUserName() && this.userName && this.phoneNumber && phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorUserName = false;
      this.showErrorPhnNO = false;
      this.showError = false;
      this.EditedForm.value.nickname = this.nickname;
      this.EditedForm.value.userName = this.userName;
      this.EditedForm.value.phoneNumber = this.phoneNumber;
      this.EditedForm.value.gender = this.FormGender;

      this.compareFormGroups();
    }
  }

  checkExistingUserName(): boolean {
    if (this.nickname !== this.tempForm.value.nickname) {
      this.couchService.checkExistingUserName(this.nickname).subscribe((res: any) => {
        if (res.rows.length === 1) {
          this.Edited = true;
          this.showErrorNickName = true;
          this.toastService.showToast('Nick Name Already used', true);
          return false
        }
        return true
      });
    }
    return true
  }

}