import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit{
userData: any;
  notifications!: any[];
constructor(private firebaseService: FirebaseService) {}

ngOnInit(): void {
  const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
      console.log(this.userData);
    }
    
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
}
