import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface User {
  userName: string;
  phoneNumber: number;
  nickname: string;
  gender: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  showAddFriendDiv = false;
  showUserProfiledDiv = false;
  showErrorNickName: boolean = false;
  showErrorGender: boolean = false;
  isNickNameDiolog: boolean = false;
  showErrorDob: boolean = false;
  isFriendRequest = false;
  isGenderMale = false;
  isGenderFemale = false;
  FriendRequestList: any[] = [];
  UserList: User[] = [];
  tempPhone: any;
  nickNameForm!: FormGroup;
  birthdate: string = ''; 
  age!: number; 
  nextBirthday: Date | null = null;
  nickname: string = '';
  gender: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private title: Title,
    private userService: FirebaseService,
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private router: Router) { }

  toggleBottomDiv() {
    this.showAddFriendDiv = !this.showAddFriendDiv;
  }

  toggleProfileBottomDiv() {
    this.showUserProfiledDiv = !this.showUserProfiledDiv;
  }

  toggleMale() {
    this.isGenderFemale = false;
    this.isGenderMale = true;
    this.gender = 'male';
  }

  toggleFemale() {
    this.isGenderMale = false;
    this.isGenderFemale = true;
    this.gender = 'female';
  }

  share() {
    const textToShare = 'Check out this link: https://amorchat-v1.web.app/';
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(whatsappUrl, '_blank');
  }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | chat");
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('login');
    } else {
      this.tempPhone = localStorage.getItem('token');
      console.log(this.tempPhone);
      this.getUser(this.tempPhone)
     //analytics().setUserProperties({ gender });
      this.FriendRequestList = [
        {
          friendrequest: [
            {
              userName: "Sankar",
              nickname: "sankar_org",
              phoneNumber: 9876345623
            },
            {
              usernNme: "Vasanth",
              nickname: "mass_vasanth",
              phoneNumber: 9360733323
            },
            {
              userName: "Priya",
              nickname: "priya_queen",
              phoneNumber: 7373370386
            }
          ]
        }
      ];
    }
    this.nickNameForm = this.fb.group({
      nickname: [''],
      gender: [''],
      age: [''],
      dob: [''],
      nxtBday: ['']
    });
  }

  logOut() {
    localStorage.setItem('token', "");
    this.router.navigateByUrl('login');
  }

  getUser(phoneNumber: any) {
    const usersRef = this.db.list('users', (ref) =>
    ref.orderByChild('phoneNumber').equalTo(Number(phoneNumber))
  );
  const users$: Observable<any[]> = usersRef.valueChanges();
  users$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((users) => {
      this.UserList = users;   
      if(!this.UserList[0].nickname) {
        this.isNickNameDiolog = true;
      }   
    });
  }

  nickNameValidation() {
    this.showErrorNickName = false;
    this.showErrorDob = false;
    this.isGenderFemale = false;
    this.isGenderMale  = false;


    if (this.nickname === "") {
      this.showErrorNickName = true;      
    } 

    if (this.gender === "") {
      this.showErrorGender = true;      
    } 
    
    if (this.age === undefined) {
      this.showErrorDob = true;
    }


  }



  calculateAge() {
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    const ageDiff = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      this.age = ageDiff - 1; 
    } else {
      this.age = ageDiff;
    }
     // Calculate next year's birthday
     const nextYear = today.getFullYear() + 1;
     this.nextBirthday = new Date(nextYear, birthDate.getMonth(), birthDate.getDate());
  }
}
