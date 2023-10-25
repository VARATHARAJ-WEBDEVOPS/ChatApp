import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent {
  UserList: any;
  paramValue: any;

  constructor(private router: Router,
    private firebaseService: FirebaseService,
    private title: Title,
  ) { }

  async ngOnInit() {
    this.title.setTitle("AmorChat | FriendProfile");


    if (!localStorage.getItem('currectChattingFriend') ) {
      this.router.navigateByUrl('/chat');
    }

    const userDataFromLocalStorage = localStorage.getItem('currectChattingFriend');

    if (userDataFromLocalStorage !== null) {
      this.paramValue = JSON.parse(userDataFromLocalStorage);
      console.log(this.paramValue);
    }

    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.UserList = JSON.parse(userdataGetting);
      console.log(this.UserList);

    }

  }

  logOut() {
    localStorage.setItem('token', "");
    localStorage.removeItem('userList');
    this.router.navigateByUrl('login');
  }

  navigateMyfriendList() {
    this.router.navigateByUrl('/myfriend');
  }

  removeFriend() {
    console.log(this.paramValue);
    
    this.firebaseService.removeFriend(this.UserList.key, this.paramValue.key).then( () => {
      this.isFriendThere(this.paramValue.userKey, this.UserList.phoneNumber);
      console.log("remove Friend",this.paramValue.userKey );
    });
  }

  isFriendThere(key: string, phoneNumber: any) {
    this.firebaseService.isFriendThere(key, phoneNumber).subscribe(res => {
        this.removeFriendListonSender(key, res[0].key);
        console.log(res[0].key);
        
    });    
  }

 async removeFriendListonSender(data: string, removekey: string) {
    this.firebaseService.removeFriend(data, removekey);
    await this.firebaseService.createNotification(data,{time: String(new Date()), message: `${this.UserList.userName} has Removed you from his  Friend List 💔`});
   await localStorage.removeItem('currectChattingFriend');
   await window.location.reload();
  }
}
