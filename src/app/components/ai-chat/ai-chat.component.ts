import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { async } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})

export class AiChatComponent {
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
    private firebaseService: FirebaseService,
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
      this.firebaseService.createNotification(this.userData.key, { time: String(new Date()), message: `Someone tried to open AmorChat AI's chat` });
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
    // this.fetchMessages();
  }

  backToChat() {
    localStorage.removeItem('currectChattingFriend');
    this.router.navigateByUrl('chat');
  }

  // scrollToContent() {
  //   if (this.content && this.content.nativeElement) {
  //     window.scrollTo(0, this.content.nativeElement.scrollHeight);
  //   }
  // }

  async sendMessage() {
    if (this.message) {
      this.receivedMessage = '';
      this.myMessageForm.value.send = this.message;

      this.getCurrentTime();
      console.log(" my Form", this.myMessageForm.value);
      // await this.firebaseService.sendAIMessage(this.userData.key, this.myMessageForm.value).then((key) => {
      //   this.AIUpdateKey = key.key;
      //   console.log(this.AIUpdateKey);
      //   this.connectWebSocket(this.message);
      // });
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

  // fetchMessages() {
  //   this.firebaseService.getAIMessages(this.userData.key).subscribe((res) => {
  //     this.Conversation = res;
  //     console.log(this.Conversation);

  //   });
  // }

  resetSelection() {
    for (const key in this.isEditontainer) {
      if (this.isEditontainer.hasOwnProperty(key)) {
        this.isEditontainer[key] = false;
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
          // chatId: crypto.randomUUID(),
          appId: "environment-event",
          systemPrompt: this.systemPrompt,
          message: message,
        })
      );
    });

    // websocket.onmessage = async (event) => {
    //   this.receivedMessage += event.data;
    //   await this.firebaseService.updateAIMssage(this.userData.key,this.AIUpdateKey,{ received: this.receivedMessage } );
    //   this.message = "";
    
    // };

    websocket.onclose = (event) => {
      if (event.code === 1000) {
        this.receiving = false;
      } else {
        this.receiving = false;
      }
    };
  }

  // messageInput.addEventListener("keydown", (event) => {
  //   if (
  //     event.key === "Enter" &&
  //     !receiving &&
  //     messageInput.value.trim() !== ""
  //   ) {
  //     event.preventDefault();
  //     sendButton.click();
  //   }
  // });

}
