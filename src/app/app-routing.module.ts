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
import { GroupCreationComponent } from './components/group-creation/group-creation.component';
import { AuthRouteService } from './auth-route.service';
import { WildcardComponent } from './components/wildcard/wildcard.component';
import { GroupProfileComponent } from './components/group-profile/group-profile.component';
import { GroupChattingComponent } from './components/group-chatting/group-chatting.component';
import { PracticeComponent } from './components/practice/practice.component';

const routes: Routes = [
  { path: '', redirectTo: 'splashScreen', pathMatch: 'full' },
  { path: 'splashScreen', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthRouteService] },
  { path: 'aichat', component: AiChatComponent, canActivate: [AuthRouteService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthRouteService] },
  { path: 'addfriend', component: AddFriendsComponent, canActivate: [AuthRouteService] },
  { path: 'myfriend', component: MyFriendsComponent, canActivate: [AuthRouteService] },
  { path: 'chatting/:data', component: ChatingComponent, canActivate: [AuthRouteService] },
  { path: 'message', component: MesssageComponent, canActivate: [AuthRouteService] },
  { path: 'notification', component: NotificationComponent, canActivate: [AuthRouteService] },
  { path: 'editprofile', component: EditpageComponent, canActivate: [AuthRouteService] },
  { path: 'groupprofile/:data', component: GroupProfileComponent, canActivate: [AuthRouteService] },
  { path: 'friendprofile/:data', component: FriendProfileComponent, canActivate: [AuthRouteService] },
  { path: 'group-creation', component: GroupCreationComponent },
  { path: 'practice', component: PracticeComponent },
  { path: 'group-chatting/:data', component: GroupChattingComponent },
  { path: '**', component: WildcardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
