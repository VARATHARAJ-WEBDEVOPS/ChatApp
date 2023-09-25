import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  showAddFriendDiv = false;
  showUserProfiledDiv = false;
  isFriendRequest = false;
  FriendRequestList: any[] = [];
  UserList: any[] = [];
  tempPhone = '9360733323';

  constructor(private db: AngularFireDatabase,
    private title: Title,
    private userService: FirebaseService,
    private router: Router) { }

  toggleBottomDiv() {
    this.showAddFriendDiv = !this.showAddFriendDiv;
  }

  toggleProfileBottomDiv() {
    this.showUserProfiledDiv = !this.showUserProfiledDiv;
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

    //  this.tempPhone = localStorage.getItem('token');
      console.log(this.tempPhone);
      this.db.list('/users', (ref) => ref.orderByChild('phoneNumber').equalTo((this.tempPhone)))
      .valueChanges()
      .subscribe((data) => {
        if (data && data.length > 0) {
          console.log('Data for phone number', this.tempPhone, ':', data[0]);
          // You can access the specific array element using data[0]
        } else {
          console.log('No data found for phone number', this.tempPhone);
        }
      });
      this.getUser(this.tempPhone);

      this.FriendRequestList = [
        {
          friendrequest: [
            {
              username: "Sankar",
              nickname: "sankar_org",
              phonenumber: 9876345623
            },
            {
              username: "Vasanth",
              nickname: "mass_vasanth",
              phonenumber: 9360733323
            },
            {
              username: "Priya",
              nickname: "priya_queen",
              phonenumber: 7373370386
            }
          ]
        }
      ];
    }
  }

  logOut() {
    localStorage.setItem('token', "");
    this.router.navigateByUrl('login');
  }

  getUser(phoneNumber: any) {
    console.log("get User Starts");

    this.userService.login(phoneNumber).subscribe((Response: any) => {
      console.log(Response);
    });
  }


}
