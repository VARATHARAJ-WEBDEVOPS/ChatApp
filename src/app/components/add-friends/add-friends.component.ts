import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { CouchService } from 'src/app/services/couch.service';
import { v4 as uuidv4 } from 'uuid';

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

  constructor(
    private firebaseService: FirebaseService,
    private title: Title,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private couchService: CouchService
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

  ngOnInit(): void {
    this.title.setTitle("AmorChat | AddFriends");
    const userDataFromLocalStorage = localStorage.getItem('userList');

    if (userDataFromLocalStorage !== null) {
      this.userdata = JSON.parse(userDataFromLocalStorage);
    }

    this.userKey = this.userdata.data._id;
    this.userphoneNumber = this.userdata.data.phoneNumber;

    this.getFriendReq();


    this.sendFriendReqForm = this.formBuilder.group({
      userName: [''],
      phoneNumber: [''],
      gender: [''],
      nickname: [''],
      friendListPathKey: ['']
    });
  }

  async getFriendReq() {
    this.couchService.getFriendRequest(this.userdata._id).subscribe((res: any) => {
      this.FriendRequestList = res.rows.map((row: any) => row.value);
    });
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
    this.firebaseService.createFriendsList(this.userdata.key, this.sendFriendReqForm.value);
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
    this.firebaseService.createFriendsList(data.userKey, this.sendFriendReqForm.value);
    this.firebaseService.createUnreadNotification(data.userKey, { time: String(new Date()), message: `🥳 ${this.userdata.userName} has Accepted your Friend Request ❤️🔒` });
    this.isReqThere(data.userKey, requestKey);
  }

  isReqThere(key: string, requestKey: any) {
    this.firebaseService.isReqThere(key, this.userdata.phoneNumber).subscribe(res => {
      this.removeFriendReqonSender(key, res[0].key);
    });
    this.removeFriendReq(requestKey);
  }

  removeFriendReqonSender(data: string, removekey: string) {
    this.firebaseService.removeFriendRequest(data, removekey);
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

  removeFriendReq(data: string) {
    this.firebaseService.removeFriendRequest(this.userdata.key, data);

  }



  async checkFriendExists(key: string, nickname: string) {

    const existsInBothPaths = await this.firebaseService.checkFriendExists(key, this.userdata.phoneNumber);

    if (existsInBothPaths === true) {

      this.toast.showToast(` you and ${nickname} are Already Friends`, true)
    } if (existsInBothPaths === false) {
      this.checkRequestExists(key, nickname);
    }
  }

  async checkRequestExists(key: string, nickname: any) {
    const existsInBothPaths = await this.firebaseService.checkRequestExists(key, this.userdata.phoneNumber);

    if (existsInBothPaths === true) {
      this.toast.showToast(`Friend Request Already Send! but ${nickname} cant't Accept yet `, true)
    } if (existsInBothPaths === false) {
      // this.sendFriendRequest(key);
    }
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

    await this.couchService.sendFriendRequest(frndReqFormat).subscribe((res: any) => {
    });
    this.couchService.createNotification(notificationFormat).subscribe((res: any) => {
    });
  }

  createContact(data: any) {
    this.firstPersion(data);
  }

  firstPersion(data: any) {          //my contact
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
        console.log(res);
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
      this.isSearchResults = false;
    }
  }

  cancelSearch() {
    this.query = '';
    this.isSearchResults = false;

  }
}
