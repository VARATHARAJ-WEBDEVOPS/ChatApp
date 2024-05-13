import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';
import { CouchService } from 'src/app/services/couch.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.css']
})
export class ChatingComponent implements OnInit {
handleKeyPress($event: KeyboardEvent) {
  console.log('test');
  
}

  @ViewChild('contentsss') content!: ElementRef;

  paramValue: any;
  data!: any;
  sendMessageForm!: FormGroup;
  myMessageForm!: FormGroup;
  message!: string;
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
  selectedImage!: File;

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

  selectedSendFile(event: any) {

    this.selectedImage = event.target.files[0];
    console.log(this.selectedImage);
    this.sendImage();
  }

  sendImage() {
    if (this.selectedImage) {
      this.couchService.uploadFiles(this.selectedImage).subscribe((res: any) => {
        console.log(res);
      })
    }
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
    else {
      console.log(`Touched at index ${index}`);
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

    this.getChat();
  }

  getChat() {
    this.couchService.getChat(this.userData._id, this.paramValue.for).subscribe((res: any) => {
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
    });
  }

  backToChat() {
    localStorage.removeItem('currectChattingFriend');
    this.router.navigateByUrl('chat');
  }

  scrollToContent() {
    if (this.content?.nativeElement) {
      window.scrollTo(0, this.content.nativeElement.scrollHeight);
    }
  }

  async sendMessage() {
    if (this.message && this.message.trim() !== "") {
      this.myMessageForm.value.send = this.message;
      this.sendMessageForm.value.received = this.message;

      this.myChatListForm.value.lastmessage = this.message;
      this.hisChatListForm.value.lastmessage = this.message;
      this.hisChatListForm.value.count = Number(this.hisChatListForm.value.count) + Number(1);

      this.getCurrentTime();

      const sendMessageFormat = {
        _id: "chats_2_" + uuidv4(),
        data: {
          time: this.getCurrentTime(),
          currentTime: new Date(),
          isDelete: false,
          isEdited: false,
          isFile: false,
          received: '',
          send: this.message,
          user: this.userData._id,
          with: this.paramValue.for,
          type: 'chats'
        }
      }
      console.log(sendMessageFormat);

      this.couchService.createChat(sendMessageFormat).subscribe((res) => {
        const sendMessageFormat = {
          _id: "chats_2_" + uuidv4(),
          data: {
            time: this.getCurrentTime(),
            currentTime: new Date(),
            isDelete: false,
            isEdited: false,
            received: this.message,
            send: '',
            user: this.paramValue.for,
            with: this.userData._id,
            type: 'chats'
          }
        }
        this.couchService.createChat(sendMessageFormat).subscribe((res) => {

          this.couchService.getContactForDelete(this.paramValue.for, this.userData._id).subscribe((res: any) => {
            console.log(res);
            const couchFormat = {
              _id: res.rows[0].value._id,
              _rev: res.rows[0].value._rev,
              data: {
                for: res.rows[0].value.data.for,
                lastmessage: this.message,
                lasttime: this.getCurrentTime(),
                type: "contacts",
                user: res.rows[0].value.data.user
              }
            }
            console.log(couchFormat);
            this.couchService.updatecontact(res.rows[0].value._id, res.rows[0].value._rev, couchFormat).subscribe((res) => {

              this.couchService.getContactForDelete(this.userData._id, this.paramValue.for).subscribe((res: any) => {
                console.log(res);
                const couchFormat = {
                  _id: res.rows[0].value._id,
                  _rev: res.rows[0].value._rev,
                  data: {
                    for: res.rows[0].value.data.for,
                    lastmessage: this.message,
                    lasttime: this.getCurrentTime(),
                    type: "contacts",
                    user: res.rows[0].value.data.user
                  }
                }
                console.log(couchFormat);
                this.couchService.updatecontact(res.rows[0].value._id, res.rows[0].value._rev, couchFormat).subscribe((res) => {
                  this.message = "";
                  this.getChat();
                  console.log("done");
                });
              });
            });
          });
        });
      });
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
    for (let i = 0; i < this.isEditontainer.length; i++) {
      this.isEditontainer[i] = false;
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
