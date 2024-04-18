import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';


@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  isFriendRequest = true;
  FriendsList: any[] = [];
  isSearchResults: boolean = false;
  searchResults: any[] = [];
  query!: string;
  sendFriendReqForm!: FormGroup;
  userdata: any;
  userKey: any;
  userphoneNumber: any;

  constructor(
    private firebaseService: FirebaseService,
    private title: Title,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | MyFriends");

    this.route.params.subscribe(params => {
      // Decode JSON data
      const encodedData = params['data'];
      if (encodedData) {
          this.userdata = JSON.parse(decodeURIComponent(encodedData));
  }});

    this.userKey = this.userdata.key;
    this.userphoneNumber = this.userdata.phoneNummber;

    this.getFriends();
    this.sendFriendReqForm = this.formBuilder.group({
      userName: [''],
      phoneNumber: [''],
      gender: [''],
      nickname: ['']
    });
  }

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
        this.searchResults = res.filter((result) => result.phoneNumber !== this.userdata.phoneNumber
          && result.nickname !== this.userdata.nickname);
      });
    }
  }

  getFriends() {
    this.firebaseService.getFriends(this.userdata.key).subscribe((res) => {
      this.FriendsList = res;
      console.log("My Friends List", this.FriendsList);
    });
  }

  removeFriend(data: any) {
    this.firebaseService.removeFriend(this.userKey, data.key).then( () => {
      this.isFriendThere(data.userKey, this.userdata.phoneNumber);
      console.log("remove Friend",data.userKey );
    });
  }

  isFriendThere(key: string, phoneNumber: any) {
    this.firebaseService.isFriendThere(key, phoneNumber).subscribe(res => {
      this.removeFriendListonSender(key, res[0].key);
    });
  }

  removeFriendListonSender(data: string, removekey: string) {
    this.firebaseService.removeFriend(data, removekey);
    this.firebaseService.createNotification(data,{time: String(new Date()), message: `${this.userdata.userName} has Removed you from his  Friend List 💔`});
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

  openChatingpage(res: any) {
    console.log(res);
    localStorage.setItem('currectChattingFriend', JSON.stringify(res));
    this.router.navigateByUrl('chatting');
  }
}
