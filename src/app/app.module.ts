import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { NgToastModule } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
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

const firebaseConfig = {
  apiKey: "AIzaSyBng3IW71ar3S_vE4Sr6c7jli1JvPW55Ws",
  authDomain: "messenger-7f2cf.firebaseapp.com",
  databaseURL: "https://messenger-7f2cf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "messenger-7f2cf",
  storageBucket: "messenger-7f2cf.appspot.com",
  messagingSenderId: "586032486460",
  appId: "1:586032486460:web:779d32bd01fd0f4ffb0b39",
  measurementId: "G-J3DV1V6D7Z"
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
    MyFriendsListsComponent
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
    AngularFireAnalyticsModule
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
