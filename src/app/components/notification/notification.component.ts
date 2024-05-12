import { Component, OnInit } from '@angular/core';
import { CouchService } from 'src/app/services/couch.service';

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
  constructor( private couchService: CouchService
  ) { }

  async ngOnInit() {
    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);

    }
    await this.getNotifications(); 
  }

  getNotifications() {
    this.couchService.getNotifications(this.userData._id).subscribe((res: any) => {
 

      
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

    });
    
  }


  clearingUnreadMessages(key: string) {
   
  }
}
