import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ToastService } from 'src/app/services/toast.service';
import { CouchService } from 'src/app/services/couch.service';
import { v4 as uuidv4 } from 'uuid';

export class User {
  key: any;
  userName!: string;
  phoneNumber!: number;
  nickname!: string;
  gender!: string;
  age!: string;
  dob!: string;
  nxtBday!: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  showUserProfiledDiv = false;
  showErrorNickName: boolean = false;
  showErrorGender: boolean = false;
  isNickNameDiolog: boolean = false;
  showErrorDob: boolean = false;
  isGenderMale = false;
  isGenderFemale = false;
  UserList: any;
  tempPhone: any;
  nickNameForm!: FormGroup;
  birthdate: string = '';
  age!: number;
  nextBirthday: Date | null = null;
  nickname: string = '';
  gender: string = '';
  selectedDay: string = '';
  selectedMonth: string = '';
  selectedYear: string = '';
  days: string[] = [];
  months: string[] = [];
  years: string[] = [];
  chatContact: any[] = [];
  groupsList: any[] = [];
  userdata: any;
  userKey: any;
  userphoneNumber: any;
  query: any;
  isSearchResults!: boolean;
  isloading: boolean = true;
  ismenu: boolean = false;
  searchTerm: any;
  isShowMyContent: boolean = false;
  unReadNotify!: number;
  userName: string = '';
  isNickname: string = '';
  contactFormat!: FormGroup;
  rawContact: any;
  userData: any;
  isGroupTab: boolean = false;

  constructor(
    private title: Title,
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private router: Router,
    private analytics: AngularFireAnalytics,
    private toastService: ToastService,
    private couchService: CouchService
  ) { }

  toggleGroupTab() {
    this.isGroupTab = true;
  }

  toggleChatTab() {
    this.isGroupTab = false;
  }


  navigateProfile() {
    this.router.navigateByUrl('profile');
  }

  navigateNotification() {
    this.router.navigateByUrl('notification');
  }

  navigateAddfriend() {
    this.router.navigateByUrl('addfriend');
  }

  toggleMenu() {
    this.ismenu = !this.ismenu;
  }

  toggleMale() {
    this.gender = "male";
    this.isGenderFemale = false;
    this.isGenderMale = true;
  }

  toggleFemale() {
    this.gender = "female";
    this.isGenderMale = false;
    this.isGenderFemale = true;
  }

  ngOnInit(): void {
    this.title.setTitle("chatApp | chat");

    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('login');
    }


    this.tempPhone = localStorage.getItem('token');
    this.getUser(this.tempPhone);

    for (let i = 1; i <= 31; i++) {
      this.days.push(i.toString());
    }

    this.months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    const currentYear = new Date().getFullYear() - 13;

    for (let i = currentYear; i >= currentYear - 100; i--) {
      this.years.push(i.toString());
    }



    this.contactFormat = this.fb.group({
      for: "",
      lastmessage: "",
      lasttime: "",
      userName: "",
      phoneNumber: null,
      nickname: "",
      age: null,
      gender: "",
      dob: null
    });
    this.nickNameForm = this.fb.group({

      _id: '',
      _rev: '',
      data: {}
    });

  }

  getUser(phoneNumber: string) {
    this.couchService.checkExistingUser(phoneNumber).subscribe((response: any) => {
      let res: any = response.rows[0].value;
      localStorage.setItem("userList", JSON.stringify(res));
      this.isNickNameDiolog = false;

      const userDataFromLocalStorage = localStorage.getItem('userList');
      if (userDataFromLocalStorage !== null) {
        this.userdata = JSON.parse(userDataFromLocalStorage);
      }
      this.userName = this.userdata.data.userName;
      this.nickNameForm.patchValue(this.userdata);



      if (response) {
        if (!this.userdata.data.nickname) {
          this.isNickNameDiolog = true;
        } else {
          const userDataFromLocalStorage = localStorage.getItem('userList');
          if (userDataFromLocalStorage !== null) {
            this.userdata = JSON.parse(userDataFromLocalStorage);
            this.userKey = this.userdata._id;
            this.userphoneNumber = this.userdata.phoneNummber;
            this.isNickname = this.userdata.nickname;
            this.getContacts();
            this.getGroup();
          }
        }
      }
    });
  }

  changeUpper() {
    this.nickname = this.nickname.toLowerCase();
  }

  calculateAge() {
    this.birthdate = (`${this.selectedDay}/${this.selectedMonth}/${this.selectedYear}`);
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    const ageDiff = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      this.age = ageDiff - 1;
    } else {
      this.age = ageDiff;
    }
  }

  checkExistingUserName() {
    this.couchService.checkExistingUserName(this.nickname).subscribe((res: any) => {
      if (res.rows.length === 1) {
        this.toastService.showToast('Nick Name Already used', true);
      } else {
        this.updateNickName();
      }
    });
  }

  async updateNickName() {
    this.nickNameForm.value.data.nickname = this.nickname;
    this.nickNameForm.value.data.gender = this.gender;
    this.nickNameForm.value.data.age = this.age;
    this.nickNameForm.value.data.dob = this.birthdate;


    await this.couchService.updateNickName(this.userdata._id, this.userdata._rev, this.nickNameForm.value).subscribe(() => {
      localStorage.removeItem('userList');
      this.getUser(this.tempPhone);
    });
    const notificationFormat = {
      _id: 'notification_2_' + uuidv4(),
      data: {
        time: String(new Date()),
        message: `Hai 🙋‍♂️ ${this.nickname} Welcome to AmorChat .`,
        type: 'notification',
        user: this.userdata._id
      }
    }

    this.couchService.createNotification(notificationFormat).subscribe((res: any) => {

    });
  }

  async nickNameValidation() {
    this.nickNameForm.patchValue(this.userdata);

    this.calculateAge()

    this.showErrorNickName = false;
    this.showErrorDob = false;
    this.showErrorGender = false;
    const usernamePattern = /[!@#$%^&*()+{}\[\]:;<>,.?~\\]/.test(this.nickname);

    if (this.nickname === "") {
      this.showErrorNickName = true;
    }
    else if (this.gender === "") {
      this.showErrorGender = true;
    } else if (!this.selectedDay) {
      this.toastService.showToast('Select your Birth date', true);
      this.showErrorDob = true;
    } else if (!this.selectedMonth) {
      this.toastService.showToast('Select your Birth Month', true);
      this.showErrorDob = true;
    } else if (!this.selectedYear) {
      this.toastService.showToast('Select your Birth year', true);
      this.showErrorDob = true;
    } else if (this.nickname && this.gender && this.age) {

      this.checkExistingUserName();
    }
  }

  openGroupChatting(data: any) {
    this.router.navigate(['/group-chatting', encodeURIComponent(JSON.stringify(data))], { skipLocationChange: true });
  }

  navigateMyFriends() {
    this.router.navigateByUrl('myfriend');
  }

  openAIChatingpage() {
    this.router.navigateByUrl('/aichat');
  }

  openChatingpage(res: any) {
    this.router.navigate(['/chatting', encodeURIComponent(JSON.stringify(res))], { skipLocationChange: true });
  }

  openGroupProfile(res: any) {
    this.router.navigate(['/groupprofile', encodeURIComponent(JSON.stringify(res))], { skipLocationChange: true });
  }

  openProfile(res: any) {
    this.router.navigate(['/friendprofile', encodeURIComponent(JSON.stringify(res))], { skipLocationChange: true });
  }

  getContacts() {
    this.couchService.getContacts(this.userKey).subscribe((res: any) => {


      if (res.rows.length) {
        let for_ids = res.rows.map((row: any) => row.value[1]);

        this.rawContact = res.rows.map((row: any) => row.value[0]);

        this.couchService.getContactUserDetails(for_ids.join('","')).subscribe((res: any) => {
          this.userData = res.rows;

          for (let i = 0; i < this.userData.length; i++) {
            for (let j = 0; j < this.userData.length; j++) {

              if (this.rawContact[i].data.for === this.userData[j].id) {

                this.contactFormat.value.for = this.rawContact[i].data.for;
                this.contactFormat.value.lastmessage = this.rawContact[i].data.lastmessage;
                this.contactFormat.value.contact_id = this.rawContact[i]._id;
                this.contactFormat.value.contact_rev = this.rawContact[i]._rev;
                this.contactFormat.value.lasttime = this.rawContact[i].data.lasttime;
                this.contactFormat.value.userName = this.userData[j].doc.data.userName;
                this.contactFormat.value.phoneNumber = this.userData[j].doc.data.phoneNumber;
                this.contactFormat.value.nickname = this.userData[j].doc.data.nickname;
                this.contactFormat.value.age = this.userData[j].doc.data.age;
                this.contactFormat.value.gender = this.userData[j].doc.data.gender;
                this.contactFormat.value.dob = this.userData[j].doc.data.dob;
                this.contactFormat.value.to_id = this.userdata._id;
                this.contactFormat.value.to_name = this.userdata.data.userName;
                this.chatContact.push(this.contactFormat.value);
                this.contactFormat.reset();
              }
            }
          }
        });
      }
      this.isloading = false;
    });
  }

  getGroup() {    
    if (this.userdata.data.groups) {
      this.couchService.getGroup(this.userdata.data.groups.join('","')).subscribe((res: any) => {      
        this.groupsList = res.rows.map((res: any) => res.doc);
        this.groupsList = this.groupsList.filter((data: any) => data !== null );
      });
    }
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

  searchProducts() {
    this.searchTerm = this.searchTerm.toLowerCase();
    if (this.searchTerm.trim() === '') {
      this.getContacts();
    } else if (this.searchTerm.trim() !== '') {
      this.chatContact = this.chatContact.filter(product =>
        Object.values(product).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

}
