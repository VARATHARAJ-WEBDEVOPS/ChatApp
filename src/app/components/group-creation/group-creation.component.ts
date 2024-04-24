import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CouchService } from 'src/app/services/couch.service';
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

  constructor(private couchService: CouchService) { }

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
        // this.searchResults = this.selectedContacts.filter( (map: any) => this.searchResults.map(item => item._id !== map._id) );
        let compareIDs = this.selectedContacts.map((ids: any) => ids._id);
        // console.log(compareIDs);
        
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
    // console.log(JSON.stringify(this.selectedContacts));
    
    }

    createGroup() {
     let couchFromat = {
        _id: '',
        data: {
          isGroup: true,
          groupName: this.Query,
          admin: [this.userdata._id],
          peoples: [this.userdata._id],
          lastmessage: "",
          lasttime: "",
          type: "contacts",
          user: ''
        }
      }
      this.selectedContacts.forEach(id => couchFromat.data.peoples.push(id._id))
      // console.log(couchFromat);
      // console.log(this.selectedContacts);
      for(let i = 0; i < couchFromat.data.peoples.length; i++) {       
        couchFromat.data.user = couchFromat.data.peoples[i];
        console.log(couchFromat.data.user)
        couchFromat._id = "group_2_" + uuidv4();
        // console.log(couchFromat);
        this.couchService.createAccount(couchFromat).subscribe((res: any) => {
          console.log("good :)");
          
        })
      }
    }

    removeContact(name: string){
      this.selectedContacts.splice(this.selectedContacts.findIndex(item => item.data.nickname === name),1)
    }
      
}
