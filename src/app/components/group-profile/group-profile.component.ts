import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CouchService } from 'src/app/services/couch.service';

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  styleUrls: ['./group-profile.component.css']
})
export class GroupProfileComponent implements OnInit{
  paramValue: any;
  peoples: any[] = [];
  userData: any;
  backData: string = '';

  constructor(public route: ActivatedRoute, private couchService: CouchService) {}

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

  getPeople() {
    const data = this.paramValue.data.peoples.join('","');
    // console.log(data);
    
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
