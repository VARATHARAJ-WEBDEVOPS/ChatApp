import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(
    private firebaseService: FirebaseService,
    private title: Title,
    public formBuilder: FormBuilder
  ) { }

  share() {
    const textToShare = 'Check out this link: https://amorchat-v1.web.app/';
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(whatsappUrl, '_blank');
  }

  search() {
    if (this.query === "") {
      this.searchResults = [];
    } else if (this.query) {
      this.searchResults = [];
      this.firebaseService.searchPartial(this.query).subscribe((res) => {
        this.searchResults = res.filter((result) => result.phoneNumber !== this.userdata.phoneNumber);
      });
    }
  }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | AddFriends");
    const userDataFromLocalStorage = localStorage.getItem('userList');

  if (userDataFromLocalStorage !== null) {

    this.userdata = JSON.parse(userDataFromLocalStorage);
  }

  this.userKey = this.userdata.key;

  this.getFriendReq();
    this.sendFriendReqForm = this.formBuilder.group({
      userName: [''],
      phoneNumber: [''],
      gender: [''],
      nickname: ['']
    });


  }




  getFriendReq() {
    this.firebaseService.getFriendRequests(this.userKey).subscribe( (res) => {
      this.FriendRequestList = res;
      console.log(this.FriendRequestList);
      
    });
  }

  createFriendList(key: any) {
    this.sendFriendReqForm.value.userName = this.userdata.userName;
    this.sendFriendReqForm.value.nickname = this.userdata.nickname;
    this.sendFriendReqForm.value.phoneNumber = this.userdata.phoneNumber;
    this.sendFriendReqForm.value.gender = this.userdata.gender;
    console.log(this.sendFriendReqForm.value);
    this.firebaseService.createFriendsList(key, this.sendFriendReqForm.value).then(()=>{
      this.removeFriendReq(key);
    });
  }

  removeFriendReq(key: any) {
    this.firebaseService.removeFriendRequest(this.userKey, key).then( () => {
      this.getFriendReq();
    });
  }

  sendFriendRequest(key: any) {
    console.log(this.userdata);
    this.sendFriendReqForm.value.userName = this.userdata.userName;
    this.sendFriendReqForm.value.nickname = this.userdata.nickname;
    this.sendFriendReqForm.value.phoneNumber = this.userdata.phoneNumber;
    this.sendFriendReqForm.value.gender = this.userdata.gender;
    console.log(this.sendFriendReqForm.value);
    
    this.firebaseService.sendFriendRequest(key, this.sendFriendReqForm.value);
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

}
