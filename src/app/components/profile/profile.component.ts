import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
export class ProfileComponent implements OnInit {

  UserList: User[] = [];
  conformlogout: boolean = false;
  Userdata: any;

  constructor(private router: Router,
    private title: Title,
  ) { }

  async ngOnInit() {
    this.title.setTitle("AmorChat | Profile");

    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('login');
    } 
    
    // console.log(localStorage.getItem('userList'));
    const userListString = localStorage.getItem('userList');

    if (userListString !== null) {
      this.Userdata = JSON.parse(userListString);
   
    }
    this.UserList[0]=this.Userdata.data;    
  }

  conformlogoutToggle() {
    this.conformlogout = !this.conformlogout;
  }

  logOut() {
    localStorage.setItem('token', "");
    localStorage.removeItem('userList');
    this.router.navigateByUrl('login');
  }

  navigateMyfriendList() {
    this.router.navigateByUrl('/myfriend');
  }

}
