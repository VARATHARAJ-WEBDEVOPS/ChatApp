import { Component, OnInit } from '@angular/core';
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
    private title: Title,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | MyFriends");

    this.route.params.subscribe(params => {
      const encodedData = params['data'];
      if (encodedData) {
          this.userdata = JSON.parse(decodeURIComponent(encodedData));
  }});

    this.userKey = this.userdata.key;
    this.userphoneNumber = this.userdata.phoneNummber;

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
