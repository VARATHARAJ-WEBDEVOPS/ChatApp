import { Component, OnInit } from '@angular/core';
import { CouchService } from 'src/app/services/couch.service';
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
  constructor(private firebaseService: FirebaseService,
    private couchService: CouchService
  ) { }

  async ngOnInit() {
    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
      // console.log(this.userData);
    }
    await this.getNotifications(); 
  }

  getNotifications() {
    this.couchService.getNotifications(this.userData._id).subscribe((res: any) => {
      // console.log(res.rows.map((row: any)=>row.value));

      
           this.notifications = res.rows.map((row: any)=>row.value).sort((a: any, b: any) => {
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
    // console.log(this.notifications);

    });
    
  }

  // gettingUnreadedNotifications() {
  //   this.firebaseService.gettingUnreadedNotifications(this.key).subscribe((res) => {
  //     this.unreadedMessages = res;
  //     this.putNotifyIntoNotification();
  //   })
  // }

  // async putNotifyIntoNotification() {
  //   for (let i = 0; i <= this.unreadedMessages.length; i++) {
  //     await this.firebaseService.createNotification(this.userData.key, this.unreadedMessages[i]);
  //     this.firebaseService.removeUnreadNotification(this.userData.key, this.unreadedMessages[i].key);
  //   }
  //   this.unreadedMessages = [];
  // }

  clearingUnreadMessages(key: string) {
   
  }
}
