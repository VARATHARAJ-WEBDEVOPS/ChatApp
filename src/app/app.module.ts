import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { NgToastModule } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAnalyticsModule, CONFIG , ScreenTrackingService, UserTrackingService } from '@angular/fire/compat/analytics';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { ContactComponent } from './components/contact/contact.component';
import { MesssageComponent } from './components/messsage/messsage.component';
import { SignupComponent } from './components/signup/signup.component';
import { ToastComponent } from './components/toast/toast.component';
import { ChatComponent } from './components/chat/chat.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddFriendsComponent } from './components/add-friends/add-friends.component';
import { MyFriendsListsComponent } from './components/my-friends-lists/my-friends-lists.component';
import { MyFriendsComponent } from './components/my-friends/my-friends.component';
import { ChatingComponent } from './components/chating/chating.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DatePipePipe } from './date-pipe.pipe';
import { EditpageComponent } from './components/editpage/editpage.component';
import { FriendProfileComponent } from './components/friend-profile/friend-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { NoCopyPasteDirective } from './directives/no-copy-paste.directive';
import { GroupCreationComponent } from './components/group-creation/group-creation.component';
import { GroupProfileComponent } from './components/group-profile/group-profile.component';
import { GroupChattingComponent } from './components/group-chatting/group-chatting.component';

const firebaseConfig = {
  apiKey: "AIzaSyBnqwvPQV9ZyuTpM6qZJlLxH1uQr8b4XKo",
  authDomain: "amorchat-v1.firebaseapp.com",
  databaseURL: "https://amorchat-v1-default-rtdb.firebaseio.com",
  projectId: "amorchat-v1",
  storageBucket: "amorchat-v1.appspot.com",
  messagingSenderId: "47176735470",
  appId: "1:47176735470:web:00b77ca7790cc96434b1ff",
  measurementId: "G-52B4RW2LW9"
};

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LoginComponent,
    ContactComponent,
    MesssageComponent,
    SignupComponent,
    ToastComponent,
    ChatComponent,
    ProfileComponent,
    AddFriendsComponent,
    MyFriendsListsComponent,
    MyFriendsComponent,
    ChatingComponent,
    NotificationComponent,
    DatePipePipe,
    EditpageComponent,
    FriendProfileComponent,
    NoCopyPasteDirective,
    GroupCreationComponent,
    GroupProfileComponent,
    GroupChattingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    NgToastModule,
    CommonModule,
    AngularFireAnalyticsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ScreenTrackingService, 
    UserTrackingService,
    {
    provide: CONFIG,
      useValue: { send_page_view: true, allow_ad_personalization_signals: false }
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
