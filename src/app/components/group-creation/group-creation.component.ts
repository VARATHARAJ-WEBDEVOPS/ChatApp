import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CouchService } from 'src/app/services/couch.service';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.css']
})
export class GroupCreationComponent implements OnInit {

  Query: string = '';
  showError!: string;
  errorColor: string = '';
  isSearchContact: boolean = false;
  searchResults: any[] = [];
  selectedContacts: any[] = [];
  query: string = "";
  userdata: any;
  isLoader: boolean = false;

  constructor(private couchService: CouchService, public toast: ToastService) { }

  ngOnInit(): void {
    const userDataFromLocalStorage = localStorage.getItem('userList');
    if (userDataFromLocalStorage !== null) {
      this.userdata = JSON.parse(userDataFromLocalStorage);
    }
  }

  isError() {
    this.showError = ''
    this.errorColor = ''
    if (this.Query && this.Query.length < 7) {
      this.errorColor = 'red'
      this.showError = 'Atleast 7 characters needed';
    } else {
      this.errorColor = 'green'
      this.showError = '';
    }
  }

  searchNickname() {
    if (this.query === "") {
      this.searchResults = [];
    } else if (this.query) {
      this.searchResults = [];
      this.couchService.searchUsersByName(this.query).subscribe((res: any) => {
        this.searchResults = res.rows.map((row: any) => row.value);
        this.searchResults = this.searchResults.filter(item => item._id !== this.userdata._id);
        let compareIDs = this.selectedContacts.map((ids: any) => ids._id);

        for (let i = 0; i < this.selectedContacts.length; i++) {
          this.searchResults = this.searchResults.filter(item => item._id !== compareIDs[i]);
        }
      })
    }
  }

  addToSelectedContact(data: any) {
    this.query = '';
    this.searchResults = [];
    this.isSearchContact = !this.isSearchContact;
    this.selectedContacts.push(data);
  }

  createGroup() {
    this.isLoader = true;
    let couchFormat = {
      _id: "group_2_" + uuidv4(),
      data: {
        groupName: this.Query,
        admin: [this.userdata._id],
        peoples: [this.userdata._id],
        lastmessage: "",
        lasttime: "",
        type: "group",
      }
    }

    this.selectedContacts.forEach(id => couchFormat.data.peoples.push(id._id));

    if (couchFormat.data.peoples.length === this.selectedContacts.length + 1) {
      this.couchService.createAccount(couchFormat).subscribe((res: any) => {
        console.log(res);
        this.pushGroupIdToUSerData(couchFormat, res.id);
      });
    }
  }

  pushGroupIdToUSerData(couchFormat: any, groupId: string) { 

    let usersForUpdateGroup: any[] = [];

    this.couchService.getPeoples(couchFormat.data.peoples.join('","')).subscribe((res: any) => {
      console.log(res);
      usersForUpdateGroup = res.rows.map((res: any) => res.doc);

      for (let i = 0; i < usersForUpdateGroup.length; i++) {

        usersForUpdateGroup[i].data.groups.push(groupId);

        this.couchService.
          updateUserProfile(usersForUpdateGroup[i]._id, usersForUpdateGroup[i]._rev,
            usersForUpdateGroup[i]
          ).subscribe((res) => {
            console.log(i, 'completed', res);
            this.isLoader = false;
            this.toast.showToast('Group created', true);
            this.Query = '';
            this.selectedContacts = [];
          });
      }
    });


  }

  removeContact(name: string) {
    this.selectedContacts.splice(this.selectedContacts.findIndex(item => item.data.nickname === name), 1)
  }

}
