import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

export class User {
  key: any;
  userName!: string;
  phoneNumber!: number;
  nickname!: string;
  gender!: string;
  age!: string;
  dob!: string;
  nxtBday!: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  showUserProfiledDiv = false;
  showErrorNickName: boolean = false;
  showErrorGender: boolean = false;
  isNickNameDiolog: boolean = false;
  showErrorDob: boolean = false;
  isGenderMale = false;
  isGenderFemale = false;
  UserList: User[] = [];
  tempPhone: any;
  nickNameForm!: FormGroup;
  birthdate: string = '';
  age!: number;
  nextBirthday: Date | null = null;
  nickname: string = '';
  gender: string = '';
  selectedDay: string = '';
  selectedMonth: string = '';
  selectedYear: string = '';
  days: string[] = [];
  months: string[] = [];
  years: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private title: Title,
    private userService: FirebaseService,
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private router: Router,
    private analytics: AngularFireAnalytics
    ) { }


  navigateProfile() {
    this.router.navigateByUrl('profile');
  }

  navigateAddfriend() {
    this.router.navigateByUrl('addfriend');
  }

  toggleMale() {
    this.gender = "male";
    this.isGenderFemale = false;
    this.isGenderMale = true;
  }

  toggleFemale() {
    this.gender = "female";
    this.isGenderMale = false;
    this.isGenderFemale = true;
  }


  ngOnInit(): void {
    this.title.setTitle("AmorChat | chat");
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('login');
    } else {
      
     this.tempPhone = localStorage.getItem('token');
      this.getUser(this.tempPhone);
      
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
     
    }
    this.nickNameForm = this.fb.group({
      nickname: [''],
      gender: [''],
      age: [''],
      dob: ['']
    });
  }


  getUser(phoneNumber: any) {
    const usersRef = this.db.list('users', (ref) =>
      ref.orderByChild('phoneNumber').equalTo(Number(phoneNumber))
    );
    const users$: Observable<any[]> = usersRef.snapshotChanges();

    users$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((snapshot) => {
        this.UserList = snapshot.map((user) => {
         
      
          const key = user.key;
          const data = user.payload.val();
          return { key, ...data };
          
        });
        localStorage.setItem("userList", JSON.stringify(this.UserList[0]));    
        this.isNickNameDiolog = false;

        if (!this.UserList[0].nickname) {
          this.isNickNameDiolog = true;
        }
      });
  }

  nickNameValidation(): void {
    this.calculateAge()
    
    this.showErrorNickName = false;
    this.showErrorDob = false;
    this.showErrorGender = false;

    if (this.nickname === "") {
      this.showErrorNickName = true;
    }
    if (this.gender === "") {
      this.showErrorGender = true;
    }
    if (this.age === undefined) {
      this.showErrorDob = true;
    }
    if (this.nickname && this.gender && this.age) {

      this.nickNameForm.value.nickname = this.nickname;
      this.nickNameForm.value.gender = this.gender;
      this.nickNameForm.value.age = this.age;
      this.nickNameForm.value.dob = this.birthdate;
      console.log(this.nickNameForm.value);

      this.firebaseService.updateItem(this.UserList[0].key, this.nickNameForm.value).then(()=>{
        localStorage.removeItem('userList');
        this.getUser(this.tempPhone);
        const UserGender = this.UserList[0].gender;
      this.analytics.setUserProperties({ UserGender });
      });
    }
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
}
