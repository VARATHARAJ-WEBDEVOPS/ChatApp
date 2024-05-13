import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})

export class AiChatComponent {
handleKeyPress($event: KeyboardEvent) {
throw new Error('Method not implemented.');
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
  CheckCredentials: string = '';
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
  AIUpdateKey!: any;

  constructor(private title: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.isEditontainer = new Array().fill(false);
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
    if (!this.CheckCredentials) {
      this.showError = true;
    } else if (this.CheckCredentials === this.userData.password) {
      this.secure = true;
      this.passwordDiolog = false;
      this.CheckCredentials = "";
    } else {
      this.showError = true;
      this.toastService.showToast('wrong password', true);
    }
  }

  ngOnInit() {

    this.title.setTitle("AmorChat | chatting");

    const userdataGetting = localStorage.getItem('userList');

    if (userdataGetting !== null) {

      this.userData = JSON.parse(userdataGetting);
      console.log(this.userData);

    }

    this.myMessageForm = this.formBuilder.group({
      time: [''],
      send: [''],
      received: [''],
      currentTime: [''],
      isEdited: [''],
      isDeleted: ['']
    });
  
  }

  backToChat() {
    localStorage.removeItem('currectChattingFriend');
    this.router.navigateByUrl('chat');
  }


  async sendMessage() {
    if (this.message) {
      this.receivedMessage = '';
      this.myMessageForm.value.send = this.message;

      this.getCurrentTime();
      console.log(" my Form", this.myMessageForm.value);
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
  }

  resetSelection() {
    for (const key in this.isEditontainer) {
      if (this.isEditontainer.hasOwnProperty(key)) {
        console.log('yes');
        
      }
    }
  }

  chatbox = document.getElementById("chatbox");
  messageInput = document.getElementById("messageInput");
  receiving = false;
  systemPrompt = "You are a Mr.S.Varatharaj devoloped an Amorchat web application's chat AI  ";
  receivedMessage: string = '';

  connectWebSocket(message: any) {
    this.receiving = true;
    const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";
    const websocket = new WebSocket(url);

    websocket.addEventListener("open", () => {
      websocket.send(
        JSON.stringify({
          appId: "environment-event",
          systemPrompt: this.systemPrompt,
          message: message,
        })
      );
    });


    websocket.onclose = (event) => {
      if (event.code === 1000) {
        this.receiving = false;
      } else {
        this.receiving = false;
      }
    };
  }

}
