import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';
import { CouchService } from 'src/app/services/couch.service';
import * as CryptoJS from 'crypto-js';
import { group } from '@angular/animations';

@Component({
  selector: 'app-group-chatting',
  templateUrl: './group-chatting.component.html',
  styleUrls: ['./group-chatting.component.css']
})
export class GroupChattingComponent implements OnInit {
handleKeyPress($event: KeyboardEvent) {
}

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
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private couchService: CouchService
  ) {
    this.isEditontainer = new Array().fill(false);
  }


  onMouseDown(event: MouseEvent, index: any) { 
    this.pressTimeout = setTimeout(() => {
      if (this.secure) { 
        this.pressTimeout = setTimeout(() => {
          this.resetSelection();
          this.isEditontainer[index] = true;
          this.isShowEditContainer = true;
        }, 500);
      }
    }, 500);
  }

  onTouchStart(event: TouchEvent, index: any) {
    if (this.secure) { 
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
    const decryptedPassword = CryptoJS.AES.decrypt(this.userData.data.password, 'secret key').toString(CryptoJS.enc.Utf8);
    if (!this.CheckPassword) {
      this.showError = true;
    } else if (this.CheckPassword === decryptedPassword) {
      this.secure = true;
      this.passwordDiolog = false;
      this.CheckPassword = "";
    } else {
      this.showError = true;
      console.log(this.paramValue.data.userName);
      
    this.toastService.showToast('wrong password', true);
    }
  }

  ngOnInit() {

    this.title.setTitle("AmorChat | chatting");


    setTimeout(() => {
      this.scrollToContent();
    }, 1);

    this.route.params.subscribe(params => {

      const encodedData = params['data'];
      if (encodedData) {
        this.paramValue = JSON.parse(decodeURIComponent(encodedData));
      
      }
    });
    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
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
      isEdited: [''],
      isDeleted: ['']
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
      isEdited: [''],
      isDeleted: ['']
    });

   this.getChats();
  }

  getChats() {
    this.couchService.getGroupChat(this.paramValue._id).subscribe((res: any) => {
      this.Conversation = res.rows.map((res: any) => res.value).sort((a: any, b: any) => {
        try {
          const dateA = new Date(a.data.currentTime);
          const dateB = new Date(b.data.currentTime);

          if (dateA > dateB) {
            return 1;
          }
          if (dateA < dateB) {
            return -1;
          }
          return 0;
        } catch (error) {
          console.error('Error parsing dates:', error);
          return 0;
        }
      });
      console.log(this.Conversation);
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
    if (this.message && this.message.trim() !== "") {

      this.getCurrentTime();

      const sendMessageFormat = {
        _id: "groupchats_2_" + uuidv4(),
        data: {
          time: this.getCurrentTime(),
          currentTime: new Date(),
          isDelete: false,
          isEdited: false,
          sender: this.userData._id,
          senderName: this.userData.data.nickname,
          message: this.message,
          isFile: false,
          group: this.paramValue._id,
          type: 'groupchats'
        }
      }
      console.log(sendMessageFormat);

      this.couchService.createGroupChat(sendMessageFormat).subscribe((res: any) => {
        console.log(res);
        this.message = "";
        this.getChats();
      })
    }
  }

  getCurrentTime(): string {

    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    return `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
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
    this.deleteHisMgs();
  }

  async deleteHisMgs() {
    this.sendMessageForm.patchValue(this.temp[0]);
    this.sendMessageForm.value.received = "";
    this.sendMessageForm.value.isEdited = false;
    this.sendMessageForm.value.isDeleted = true;
    this.sendMessageForm.value.hisMgs = true;
    this.sendMessageForm.value.send = '';

    this.myChatListForm.value.lastmessage = "this message has been deleted by you";
    this.hisChatListForm.value.lastmessage = `this message has been deleted by ${this.userData.userName}`;
    this.deleteDiolog = false;
  }

  editAction(mgs: any) {
    this.temp[0] = mgs;
    this.editedMessage = mgs.send;
    this.editDiolog = true;
  }

  openProfile(res: any) {
    console.log(res);
    localStorage.setItem('currectChattingFriend', JSON.stringify(res));
    this.router.navigateByUrl('friendprofile');
  }

}
