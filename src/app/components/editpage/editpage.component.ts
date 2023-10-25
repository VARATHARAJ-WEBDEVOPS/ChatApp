import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editpage',
  templateUrl: './editpage.component.html',
  styleUrls: ['./editpage.component.css']
})
export class EditpageComponent implements OnInit {

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
    private firebaseService: FirebaseService,
    private router: Router
  ) {

    this.tempForm = this.fb.group({
      age: [''],
      dob: [''],
      gender: [''],
      key: [''],
      nickname: [''],
      password: [''],
      phoneNumber: [''],
      userName: ['']
    });

    this.EditedForm = this.fb.group({
      age: [''],
      dob: [''],
      gender: [''],
      key: [''],
      nickname: [''],
      password: [''],
      phoneNumber: [''],
      userName: ['']
    });


  }

  compareFormGroups(): void {
    // Get the values of the form groups
    const tempFormValues = this.tempForm.value;
    const editedFormValues = this.EditedForm.value;

    // Compare each field in the form groups
    const isEqual = Object.keys(tempFormValues).every((key) => {
      return tempFormValues[key] === editedFormValues[key];
    });

    // Set this.Edited to true if the form groups are equal
    this.Edited = isEqual;
    console.log(this.Edited);

  }

  ngOnInit(): void {

    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
      console.log(this.userData);

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

    this.tempForm.patchValue(this.userData);
    this.EditedForm.patchValue(this.userData);

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
    if (!this.CurrentPassword) {
      this.showError = true;
    } else if (this.CurrentPassword === this.userData.password) {
      this.passwordDiolog = false;
      this.CurrentPassword = "";
      this.firebaseService.updateProfile(this.userData.key, this.EditedForm.value);
      this.router.navigateByUrl('/profile');
    } else {
      this.showError = true;
      this.firebaseService.createNotification(this.userData.key, { time: String(new Date()), message: `Someone tried to Edit your Profile` });
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
       
      } else if (this.selectedDay && this.selectedMonth && this.selectedYear){
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
        this.EditedForm.value.password = this.password;
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

    const usernamePattern = /[!@#$%^&*()+{}\[\]:;<>,.?~\\]/.test(this.nickname);
    const phoneNumberPattern = /^[0-9]{10}$/;
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
    } else if (usernamePattern) {
      this.showErrorNickNameMessage = 'Nickname Support underscore ( _ ) only other symbols not valid';
      this.showErrorNickName = true;
    } else if (!/[_]/.test(this.nickname)) {
      this.showErrorNickName = true;
      this.showErrorNickNameMessage = 'use At least 1 underscore ( _ ) for Nick Name';
    } else if (this.userName && this.phoneNumber && phoneNumberPattern.test(this.phoneNumber)) {
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

}
