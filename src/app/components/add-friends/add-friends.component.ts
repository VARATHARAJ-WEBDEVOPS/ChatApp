import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { CouchService } from 'src/app/services/couch.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.css']
})

export class AddFriendsComponent implements OnInit {
  isFriendRequest = true;
  FriendRequestList: any[] = [];
  isSearchResults: boolean = false;
  searchResults: any[] = [];
  query!: string;
  sendFriendReqForm!: FormGroup;
  userdata: any;
  userKey!: string;
  userphoneNumber!: number;
  keyItem: any[] = [];
  friendListPathKey!: string;
  showTooltip: boolean = false;
  Contacts: any[] = [];
  getSentFriendReqs: any[] = [];

  constructor(
    private title: Title,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private couchService: CouchService,
    private router: Router
  ) { }

  share() {
    const textToShare = 'Check out this link: https://amorchat-v1.web.app/';
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(whatsappUrl, '_blank');
  }

  changeUpper() {
    this.query = this.query.toLowerCase();
    this.search();
  }

  search() {
    this.getSentFriendReq();
    if (this.query === "") {
      this.searchResults = [];
    } else if (this.query) {
      this.searchResults = [];
      this.couchService.searchUsersByName(this.query).subscribe((res: any) => {
        this.searchResults = res.rows.map((row: any) => row.value);
        this.searchResults = this.searchResults.filter(item => item.data.phoneNumber !== this.userphoneNumber);
      })
    }
  }

  isReqThere(result: any): boolean {
    let isFound = false;
    this.couchService.isReqThere(this.userdata._id, result._id).subscribe(
      (res: any) => {
        if (res.rows[0].length === 1) {
          isFound = true;
        } else {
          isFound = false;
        }
      }
    );
    return isFound;
  }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | AddFriends");
    const userDataFromLocalStorage = localStorage.getItem('userList');

    if (userDataFromLocalStorage !== null) {
      this.userdata = JSON.parse(userDataFromLocalStorage);
    }

    this.userKey = this.userdata.data._id;
    this.userphoneNumber = this.userdata.data.phoneNumber;

    this.getFriendReq();


    this.couchService.getContacts(this.userdata._id).subscribe((res: any) => {

      if (res.rows.length) {
        this.Contacts = res.rows.map((row: any) => row.value[0]);
        console.log(this.Contacts);
      }
    });
    this.getSentFriendReq();

    this.sendFriendReqForm = this.formBuilder.group({
      userName: [''],
      phoneNumber: [''],
      gender: [''],
      nickname: [''],
      friendListPathKey: ['']
    });

 
  }



  getSentFriendReq() {
    this.couchService.findIsFriendReq(this.userdata._id).subscribe((res: any)=> {
      this.getSentFriendReqs = res.rows.map((data: any) => data.doc);
    })
  }

  async getFriendReq() {
    this.couchService.getFriendRequest(this.userdata._id).subscribe((res: any) => {
      this.FriendRequestList = res.rows.map((row: any) => row.value);
      console.log('friendRequest', this.FriendRequestList);
    });
  }

  checkFriendRequest(userId: string): boolean {
    if (this.FriendRequestList && this.FriendRequestList.length > 0) {
      return this.FriendRequestList.some(item => item.data.from === userId);
    }
    return false;
  }

  checkFriend(userId: string): boolean {
    if (this.Contacts && this.Contacts.length > 0) {
      return this.Contacts.some(item => item.data.for === userId);
    }
    return false;
  }

  findIsFriendReq(user: string): boolean {
    if (this.getSentFriendReqs && this.getSentFriendReqs.length > 0) {
      return this.getSentFriendReqs.some(item => item.data.USERID === user);
    }
    return false
  }


  createFriendList(data: any, requestKey: string) {
    console.log("initial process Debug:", data.key);

    this.sendFriendReqForm.value.userName = data.userName;
    this.sendFriendReqForm.value.nickname = data.nickname;
    this.sendFriendReqForm.value.phoneNumber = data.phoneNumber;
    this.sendFriendReqForm.value.gender = data.gender;
    this.sendFriendReqForm.value.userKey = data.userKey;
    this.sendFriendReqForm.value.age = data.age;
    this.sendFriendReqForm.value.dob = data.dob;
    this.sendFriendReqForm.value.count = 0;
    this.sendFrndListData(data, requestKey);
  }

  sendFrndListData(data: any, requestKey: string) {
    this.sendFriendReqForm.value.userName = this.userdata.userName;
    this.sendFriendReqForm.value.nickname = this.userdata.nickname;
    this.sendFriendReqForm.value.phoneNumber = this.userdata.phoneNumber;
    this.sendFriendReqForm.value.gender = this.userdata.gender;
    this.sendFriendReqForm.value.userKey = this.userdata.key;
    this.sendFriendReqForm.value.age = this.userdata.age;
    this.sendFriendReqForm.value.dob = this.userdata.dob;
    this.sendFriendReqForm.value.count = 0;
    
  }


  cancelFriendRequest(data: any) {
    this.couchService.cancelFriendRequest(data._id, data._rev).subscribe((res) => {
      const notificationFormat = {
        _id: "notification_2_" + uuidv4(),
        data: {
          time: String(new Date()),
          message: `${this.userdata.data.userName} has rejected your Friend Request 💔`,
          type: "notification",
          user: data.data.from
        }
      }
      this.couchService.createNotification(notificationFormat).subscribe((res) => {
        this.getFriendReq();
      });
    });
  }

  async sendFriendRequest(id: string) {

    const notificationFormat = {
      _id: 'notification_2_' + uuidv4(),
      data: {
        time: String(new Date()),
        message: ` ${this.userdata.data.userName} has send you a Friend Request 💌`,
        type: 'notification',
        user: id
      }
    }

    const frndReqFormat = {
      _id: 'friendrequest_2_' + uuidv4(),
      data: {
        userName: this.userdata.data.userName,
        nickname: this.userdata.data.nickname,
        phoneNumber: this.userdata.data.phoneNumber,
        gender: this.userdata.data.gender,
        from: this.userdata._id,
        age: this.userdata.data.age,
        dob: this.userdata.data.dob,
        type: 'friendrequest',
        user: id
      }
    }
    this.couchService.sendFriendRequest(frndReqFormat).subscribe((res: any) => {
      const couchFormat = {
        _id: "friendRequestSent_2_" + uuidv4(),
        data: {
          USERID: id,
          type: "friendRequestSent",
          user: this.userdata._id
        }
      }
      this.couchService.createAccount(couchFormat).subscribe((res: any) => {
        this.couchService.createNotification(notificationFormat).subscribe((res: any) => {
          console.log('send success');
          this.search();
        });
      });
    });

  }

  createContact(data: any, _id?: string) {
    if (_id) {
      this.firstPersion(this.FriendRequestList.filter(doc => doc.data.from === data._id)[0]);
    } else {
      this.firstPersion(data);
    }
  }

  firstPersion(data: any) {         
    const couchFormat = {
      _id: "contacts_2_" + uuidv4(),
      data: {
        for: data.data.from,
        lastmessage: "",
        lasttime: "",
        type: "contacts",
        user: this.userdata._id
      }
    }
    this.couchService.createContact(couchFormat).subscribe((res: any) => {
      this.secondPersion(data);
    });
  }
  secondPersion(data: any) {       
    const couchFormat = {
      _id: "contacts_2_" + uuidv4(),
      data: {
        for: this.userdata._id,
        lastmessage: "",
        lasttime: "",
        type: "contacts",
        user: data.data.from
      }
    }
    this.couchService.createContact(couchFormat).subscribe((res: any) => {
      this.couchService.cancelFriendRequest(data._id, data._rev).subscribe((res) => {
        const notificationFormat = {
          _id: 'notification_2_' + uuidv4(),
          data: {
            time: String(new Date()),
            message: ` ${this.userdata.data.userName} has Accepted your Friend Request `,
            type: 'notification',
            user: data.data.from
          }
        }
        this.couchService.createNotification(notificationFormat).subscribe((res: any) => {
          console.log("done");
          this.getFriendReq();
        });
      })
    });
  }

  handleInputFocus() {
    this.isSearchResults = true;
  }

  handleInputBlur() {
    if (this.query) {
      this.isSearchResults = true;
    } else {
      this.query = '';
      this.isSearchResults = false;
    }
  }

  cancelSearch() {
    this.query = '';
    this.isSearchResults = false;

  }
}
