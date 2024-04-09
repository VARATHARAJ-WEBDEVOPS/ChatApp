import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ChatComponent } from './components/chat/chat.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddFriendsComponent } from './components/add-friends/add-friends.component';
import { MyFriendsComponent } from './components/my-friends/my-friends.component';
import { ChatingComponent } from './components/chating/chating.component';
import { MesssageComponent } from './components/messsage/messsage.component';
import { NotificationComponent } from './components/notification/notification.component';
import { EditpageComponent } from './components/editpage/editpage.component';
import { FriendProfileComponent } from './components/friend-profile/friend-profile.component';
import { AiChatComponent } from './components/ai-chat/ai-chat.component';

const routes: Routes = [
  {path: '', component: SplashComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'aichat', component: AiChatComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'addfriend', component: AddFriendsComponent},
  {path: 'myfriend', component: MyFriendsComponent},
  {path: 'chatting', component: ChatingComponent},
  {path: 'message', component: MesssageComponent},
  {path: 'notification', component: NotificationComponent},
  {path: 'editprofile', component: EditpageComponent},
  {path: 'friendprofile', component: FriendProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
