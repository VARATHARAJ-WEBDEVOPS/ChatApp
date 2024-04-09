import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  userData: any;
  notifications!: any[];
  unreadedMessages!: any[];
  key: string = '';
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
      console.log(this.userData);
    }
    this.key = this.userData.key
    console.log("key" + this.key);

    this.gettingUnreadedNotifications();


    this.firebaseService.getNotifications(this.userData.key).subscribe((res) => {
      this.notifications = res.sort((a, b) => {
        try {
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);

          if (dateA > dateB) {
            return -1;
          }
          if (dateA < dateB) {
            return 1;
          }
          return 0;
        } catch (error) {
          console.error('Error parsing dates:', error);
          return 0;
        }
      });
    });
  }

  gettingUnreadedNotifications() {
    this.firebaseService.gettingUnreadedNotifications(this.key).subscribe((res) => {
      this.unreadedMessages = res
      console.log(this.unreadedMessages);
      this.putNotifyIntoNotification();
    })
  }

  async putNotifyIntoNotification() {
    for (let i = 0; i <= this.unreadedMessages.length; i++) {
      await this.firebaseService.createNotification(this.userData.key, this.unreadedMessages[i]);
      this.firebaseService.removeUnreadNotification(this.userData.key, this.unreadedMessages[i].key);
    }
    this.unreadedMessages = [];
  }

  clearingUnreadMessages(key: string) {
   
  }
}
