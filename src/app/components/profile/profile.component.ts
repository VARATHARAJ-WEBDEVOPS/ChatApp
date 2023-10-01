import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  UserList: User[] = [];

  constructor(private router: Router,
    private firebaseService: FirebaseService,
    private title: Title,
   ) {}

  ngOnInit(): void {
    this.title.setTitle("AmorChat | Profile");
    console.log(localStorage.getItem('userList'));
    const userListString = localStorage.getItem('userList');

if (userListString !== null) {
  this.UserList[0] = JSON.parse(userListString);
} 
    
  }

  logOut() {
    localStorage.setItem('token', "");
    localStorage.removeItem('userList');
    this.router.navigateByUrl('login');
  }

}
