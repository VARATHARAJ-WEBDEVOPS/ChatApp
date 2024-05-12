import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CouchService } from 'src/app/services/couch.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent {
  UserList: any;
  paramValue: any;
  conformDelete: boolean = false;

  constructor(private router: Router,
    private title: Title,
    private route: ActivatedRoute,
    private couchService: CouchService
  ) { }

  ngOnInit() {
    this.title.setTitle("AmorChat | FriendProfile");
    this.route.params.subscribe(param => {

      const encodedData = param['data'];
      if (encodedData) {
        this.paramValue = JSON.parse(decodeURIComponent(encodedData));

      }
    });
  }

  conformDeleteToggle() {
    this.conformDelete = !this.conformDelete;
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
    

    this.couchService.deleteFriend(this.paramValue.contact_id, this.paramValue.contact_rev).subscribe((res) => {
      this.couchService.getContactForDelete(this.paramValue.for, this.paramValue.to_id).subscribe((res: any) => {
        this.couchService.deleteFriend(res.rows[0].value._id, res.rows[0].value._rev).subscribe((res) => {
          const notificationFormat = {
            _id: 'notification_2_' + uuidv4(),
            data: {
              time: String(new Date()),
              message: `${this.paramValue.to_name} has Removed you from his  Friend List 💔 .`,
              type: 'notification',
              user: this.paramValue.for
            }
          }
          this.couchService.createNotification(notificationFormat).subscribe((res: any) => {
            this.router.navigateByUrl('chat');
          });
        });
      });
    });
  }
}
