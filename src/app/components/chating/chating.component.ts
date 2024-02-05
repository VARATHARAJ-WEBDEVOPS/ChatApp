import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.css']
})
export class ChatingComponent implements OnInit {

  @ViewChild('contentsss') content!: ElementRef;

  paramValue: any;
  data!: any;
  sendMessageForm!: FormGroup;
  myMessageForm!: FormGroup;
  message!: String;
  userData: any;
  myPath!: string;
  friendPath!: string;
  Conversation: any[] = [];
  secure: boolean = false;
  toggle: boolean = false;
  passwordDiolog: boolean = false;
  CheckPassword!: string;
  myChatListForm!: FormGroup;
  hisChatListForm!: FormGroup;
  isEditontainer: boolean[] = new Array<any>();
  isShowEditContainer = false;
  editDiolog = false;
  deleteDiolog = false;
  editedMessage!: string;
  temp: any[] = [];
  showError: boolean = false;
  private pressTimeout: any;
  Frienddata!: FormGroup;

  constructor(private title: Title,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.isEditontainer = new Array().fill(false);  
  }


  onMouseDown(event: MouseEvent) {   //for desktop
    this.pressTimeout = setTimeout(() => {
      alert('Edit and Delete Support Only Mobile Browsers');
    }, 500);
  }

  onTouchStart(event: TouchEvent, index: any) {
    if (this.secure) { // Check if secure is true
      this.pressTimeout = setTimeout(() => {
        this.resetSelection();
        this.isEditontainer[index] = true;
        this.isShowEditContainer = true;
      }, 500);
    }
  }


  onMouseUp(event: MouseEvent) {
    if (this.pressTimeout) {
      clearTimeout(this.pressTimeout);
    }
  }

  onTouchEnd(event: TouchEvent, index: number) {
    if (this.pressTimeout) {
      clearTimeout(this.pressTimeout);
    }
  }

  toggleTheme() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.passwordDiolog = true;
    } else {
      this.passwordDiolog = false;
      this.showError = false;
      this.secure = false;
    }
  }

  conformPassword() {
    if (!this.CheckPassword) {
      this.showError = true;
    } else if (this.CheckPassword === this.userData.password) {
      this.secure = true;
      this.passwordDiolog = false;
      this.CheckPassword = "";
    } else {
      this.showError = true;
      this.firebaseService.createNotification(this.userData.key,{time: String(new Date()), message: `Someone tried to open ${this.paramValue.userName}'s chat`});
      this.toastService.showToast('wrong password', true);
    }
  }

  ngOnInit() {

    this.title.setTitle("AmorChat | chatting");


    setTimeout(() => {
      this.scrollToContent();
    }, 1);

    const userDataFromLocalStorage = localStorage.getItem('currectChattingFriend');

    if (userDataFromLocalStorage !== null) {
      this.paramValue = JSON.parse(userDataFromLocalStorage);
      console.log(this.paramValue);
    }

    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
      console.log(this.userData);

    }

    this.Frienddata = this.fb.group({
      nickname: [''],
      gender: [''],
      age: [''],
      dob: ['']
    });

    this.sendMessageForm = this.formBuilder.group({
      time: [''],
      send: [''],
      received: [''],
      currentTime: [''],
      isEdited:[''],
      isDeleted:['']
    });

    this.myChatListForm = this.formBuilder.group({

    });

    this.hisChatListForm = this.formBuilder.group({
      count: ['0']
    });

    this.myMessageForm = this.formBuilder.group({
      time: [''],
      send: [''],
      received: [''],
      currentTime: [''],
      isEdited:[''],
      isDeleted:['']
    });

    this.exchangeFriendListKey();
    this.exchangeMyFriendListKey();
  }

  

  exchangeFriendListKey() {
    this.firebaseService.searchFriendListKey(this.paramValue.userKey, this.userData.phoneNumber).subscribe((res) => {
      this.friendPath = res[0].key;
      console.log(this.friendPath);
    });
  }

  exchangeMyFriendListKey() {
    this.firebaseService.searchFriendListKey(this.userData.key, this.paramValue.phoneNumber).subscribe((res) => {
      this.myPath = res[0].key;
      console.log(this.myPath);
      this.firebaseService.changeCount(this.userData.key, this.myPath);
      this.fetchMessages();
      this.firebaseService.getUserDetails(this.paramValue.userKey).subscribe((data: any) => {
        localStorage.setItem('currectChattingFriend', JSON.stringify(data));
        console.log("changed", data);
        
      });
    });
  }



  backToChat() {
    localStorage.removeItem('currectChattingFriend');
    this.router.navigateByUrl('chat');
  }

  scrollToContent() {
    if (this.content && this.content.nativeElement) {
      window.scrollTo(0, this.content.nativeElement.scrollHeight);
    }
  }

  async sendMessage() {
    if (this.message) {
      this.myMessageForm.value.send = this.message;
      this.sendMessageForm.value.received = this.message;

      this.myChatListForm.value.lastmessage = this.message;
      this.hisChatListForm.value.lastmessage = this.message;
      this.hisChatListForm.value.count = Number(this.hisChatListForm.value.count) + Number(1);

      this.getCurrentTime();

      console.log(" Send Form", this.sendMessageForm.value);
      console.log(" my Form", this.myMessageForm.value);
      await this.firebaseService.sendMessage(this.paramValue.userKey, this.friendPath, this.sendMessageForm.value);
      await this.firebaseService.sendMessage(this.userData.key, this.myPath, this.myMessageForm.value);
      await this.firebaseService.sendquires(this.userData.key, this.myPath, this.myChatListForm.value);
      await this.firebaseService.sendquires(this.paramValue.userKey, this.friendPath, this.hisChatListForm.value);
      // this.searchIsChatList();
      this.message = "";
    }
  }

  async searchIsChatList() {
    const existsInBothPaths = await this.firebaseService.searchIsChatList(this.paramValue.userKey, this.userData.phoneNumber);

    if (existsInBothPaths === true) {
      // do update codes
      await this.firebaseService.searchChatkey(this.paramValue.userKey, this.userData.phoneNumber).subscribe((res) => {
        console.log("his id", res[0].key);
        this.firebaseService.updateChatlist(this.paramValue.userKey, res[0].key, this.hisChatListForm.value);
      });
      await this.firebaseService.searchChatkey(this.userData.key, this.paramValue.phoneNumber).subscribe((res) => {
        console.log("my id", res[0].key);
        this.firebaseService.updateChatlist(this.userData.key, res[0].key, this.hisChatListForm.value);
        this.message = "";
      });
      console.log("---update performed----");

      console.log(this.myChatListForm.value);
      console.log(this.hisChatListForm.value);
    } if (existsInBothPaths === false) {
      // do create codes
      this.firebaseService.createChatList(this.paramValue.userKey, this.hisChatListForm.value);
      this.firebaseService.createChatList(this.userData.key, this.myChatListForm.value);
      console.log("---create performed----");

      console.log(this.myChatListForm.value);
      console.log(this.hisChatListForm.value);
      this.message = "";
    }
  }



  getCurrentTime() {

    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    console.log('Current Time:', currentTime);
    this.myMessageForm.value.time = formattedTime;
    this.sendMessageForm.value.time = formattedTime;

    this.myMessageForm.value.currentTime = String(currentTime);
    this.sendMessageForm.value.currentTime = String(currentTime);

    this.myChatListForm.value.lasttime = formattedTime;
    this.myChatListForm.value.date = currentTime;
    this.hisChatListForm.value.date = currentTime;
    this.hisChatListForm.value.lasttime = formattedTime;

    this.myMessageForm.value.isEdited = false;
    this.myMessageForm.value.isDeleted = false;

    this.sendMessageForm.value.isEdited = false;
    this.sendMessageForm.value.isDeleted = false;

  }

  fetchMessages() {
    this.firebaseService.getMessages(this.userData.key, this.myPath).subscribe((res) => {
      this.Conversation = res;
      console.log(this.Conversation);

    });
  }



  resetSelection() {
    for (const key in this.isEditontainer) {
      if (this.isEditontainer.hasOwnProperty(key)) {
        this.isEditontainer[key] = false;
      }
    }
  }

  deleteAction(mgs: any) {
    this.temp[0] = mgs;
    this.deleteDiolog = true;
  }

  deleteMyMgs() {
    this.myMessageForm.patchValue(this.temp[0]);
    this.myMessageForm.value.send = '';
    this.myMessageForm.value.isEdited = false;
    this.myMessageForm.value.isDeleted = true;
    this.myMessageForm.value.myMgs = true;
    this.firebaseService.updateMessage(this.userData.key, this.myPath, this.temp[0].key, this.myMessageForm.value);
    this.deleteHisMgs();
  }

  async deleteHisMgs() {
    this.sendMessageForm.patchValue(this.temp[0]);
    this.sendMessageForm.value.received = "";
    this.sendMessageForm.value.isEdited = false;
    this.sendMessageForm.value.isDeleted = true;
    this.sendMessageForm.value.hisMgs = true;
    this.sendMessageForm.value.send = '';

   await this.firebaseService.searchMessageKey(this.paramValue.userKey, this.friendPath, this.temp[0].currentTime)
    .subscribe( (res) => {
      this.firebaseService.updateMessage(this.paramValue.userKey, this.friendPath, res[0].key, this.sendMessageForm.value);
    });
    this.myChatListForm.value.lastmessage = "this message has been deleted by you";
    this.hisChatListForm.value.lastmessage = `this message has been deleted by ${this.userData.userName}`;
    await this.firebaseService.sendquires(this.userData.key, this.myPath, this.myChatListForm.value);
    await this.firebaseService.sendquires(this.paramValue.userKey, this.friendPath, this.hisChatListForm.value);
    this.deleteDiolog = false;
  }

  editAction(mgs: any) {
    this.temp[0] = mgs;
    this.editedMessage = mgs.send;
    this.editDiolog = true;
  }

  changesMyMgs() {
    this.myMessageForm.patchValue(this.temp[0]);
    this.myMessageForm.value.send = this.editedMessage
    this.myMessageForm.value.isEdited = true;
    this.firebaseService.updateMessage(this.userData.key, this.myPath, this.temp[0].key, this.myMessageForm.value);
    this.changesHisMgs();
  }

  async changesHisMgs() {
    this.sendMessageForm.patchValue(this.temp[0]);
    this.sendMessageForm.value.received = this.editedMessage;
    this.sendMessageForm.value.isEdited = true;
    this.sendMessageForm.value.send = '';

   await this.firebaseService.searchMessageKey(this.paramValue.userKey, this.friendPath, this.temp[0].currentTime)
    .subscribe( (res) => {
      this.firebaseService.updateMessage(this.paramValue.userKey, this.friendPath, res[0].key, this.sendMessageForm.value);
       
    });
    this.myChatListForm.value.lastmessage = this.editedMessage;
    this.hisChatListForm.value.lastmessage = this.editedMessage;
    await this.firebaseService.sendquires(this.userData.key, this.myPath, this.myChatListForm.value);
    await this.firebaseService.sendquires(this.paramValue.userKey, this.friendPath, this.hisChatListForm.value);
    this.editDiolog = false;
    this.editedMessage = '';
  }

  openProfile(res: any) {
    console.log(res);
    localStorage.setItem('currectChattingFriend', JSON.stringify(res));
    this.router.navigateByUrl('friendprofile');
  }

}
