import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';

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
  userKey: any;
  userphoneNumber: any;
  keyItem: any[] = [];
  friendListPathKey!: string;
  showTooltip: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private title: Title,
    public formBuilder: FormBuilder,
    private toast: ToastService
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
      this.firebaseService.searchPartial(this.query).subscribe((res) => {
        this.searchResults = res.filter((result) => result.phoneNumber !== this.userdata.phoneNumber
          && result.nickname !== this.userdata.nickname);
          console.log(this.searchResults);
          
      });
    }
  }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | AddFriends");
    const userDataFromLocalStorage = localStorage.getItem('userList');

    if (userDataFromLocalStorage !== null) {
      this.userdata = JSON.parse(userDataFromLocalStorage);
      console.log(this.userdata);
      
    }

    this.userKey = this.userdata.key;
    this.userphoneNumber = this.userdata.phoneNummber;

    this.getFriendReq();
    this.sendFriendReqForm = this.formBuilder.group({
      userName: [''],
      phoneNumber: [''],
      gender: [''],
      nickname: [''],
      friendListPathKey: ['']
    });
  }

  getFriendReq() {
    this.firebaseService.getFriendRequests(this.userdata.key).subscribe((res) => {
      this.FriendRequestList = res;
      console.log(this.FriendRequestList);
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
    this.firebaseService.createUnreadNotification(data.userKey,{time: String(new Date()), message: `🥳 ${this.userdata.userName} has Accepted your Friend Request ❤️🔒`});
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

  removeFriendReq(data: string) {
    this.firebaseService.removeFriendRequest(this.userdata.key, data);
    
  }

  async removeFriendReqbyuser(data: any) {
    this.firebaseService.createUnreadNotification(data.userKey,{time: String(new Date()), message: `${this.userdata.userName} has rejected your Friend Request 💔`});
    await this.firebaseService.removeFriendRequest(this.userdata.key, data.key);

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
      this.sendFriendRequest(key);
    }
  }

  sendFriendRequest(key: any) {
    this.sendFriendReqForm.value.userName = this.userdata.userName;
    this.sendFriendReqForm.value.nickname = this.userdata.nickname;
    this.sendFriendReqForm.value.phoneNumber = this.userdata.phoneNumber;
    this.sendFriendReqForm.value.gender = this.userdata.gender;
    this.sendFriendReqForm.value.userKey = this.userdata.key;
    this.sendFriendReqForm.value.age = this.userdata.age;
    this.sendFriendReqForm.value.dob = this.userdata.dob;
    console.log(this.sendFriendReqForm.value);
    this.firebaseService.sendFriendRequest(key, this.sendFriendReqForm.value);
    this.firebaseService.createUnreadNotification(key,{time: String(new Date()), message: ` ${this.userdata.userName} has send you a Friend Request 💌❤️🩹` });
    return
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
