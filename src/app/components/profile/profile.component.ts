import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

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

  constructor(private router: Router,
    private firebaseService: FirebaseService,
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
      this.UserList[0] = JSON.parse(userListString);
     await  this.firebaseService.getUserDetails(this.UserList[0].key).subscribe((data: any) => {
        localStorage.setItem('userList', JSON.stringify(data));
        // console.log("changed", data);
      });
    }
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
