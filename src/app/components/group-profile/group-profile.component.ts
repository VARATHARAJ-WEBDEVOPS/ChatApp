import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CouchService } from 'src/app/services/couch.service';

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  styleUrls: ['./group-profile.component.css']
})
export class GroupProfileComponent implements OnInit {
  paramValue: any;
  peoples: any[] = [];
  userData: any;
  backData: string = '';
  isConformLeave: boolean = false

  constructor(public route: ActivatedRoute, public router: Router, private couchService: CouchService) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {

      const encodedData = param['data'];
      if (encodedData) {
        this.paramValue = JSON.parse(decodeURIComponent(encodedData));
        console.log(this.paramValue);
        this.backData = JSON.stringify(this.paramValue);
        const userdataGetting = localStorage.getItem('userList');
        if (userdataGetting !== null) {
          this.userData = JSON.parse(userdataGetting);
        }
        this.getPeople();
      }
    });
  }

  toggleLeaveGroupDialog() {
    this.isConformLeave = !this.isConformLeave;
  }

  leaveGroup() {
    this.paramValue.data.peoples.splice(this.paramValue.data.peoples.findIndex((item: any) => item === this.userData._id), 1);
    this.couchService.updateGroup(this.paramValue._id, this.paramValue._rev, this.paramValue).subscribe((res: any) => {
      console.log(res);
      this.couchService.updateUserProfile(this.userData._id, this.userData._rev, this.userData).subscribe((res: any) => {
        this.toggleLeaveGroupDialog();
        this.router.navigateByUrl('chat');
      });
    });
  }

  getPeople() {
    const data = this.paramValue.data.peoples.join('","');


    this.couchService.getPeoples(data).subscribe((res: any) => {
      this.peoples = res.rows.map((res: any) => res.doc);
      console.log(this.peoples);
    })
  }

  checkIsAdmin(): boolean {
    let isAdmin = false;
    const adminId = this.paramValue.data.admin[0];

    if (adminId === this.userData._id) {
      isAdmin = true;
      return isAdmin
    }
    return isAdmin
  }

}
