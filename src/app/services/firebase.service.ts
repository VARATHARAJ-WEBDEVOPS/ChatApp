import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private users: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.users = db.list('/users');
  }

  private dataSubject = new BehaviorSubject<any>('');
  data$ = this.dataSubject.asObservable();

  setData(data: any) {
    this.dataSubject.next(data);
  }

  createItem(item: any) {
    this.users.push(item).then((response) => {
      console.log('Item added successfully with key:', response.key);
    });
  }

  getItems(): Observable<any[]> {
    return this.users.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
    );
  }

  updateItem(key: string, value: any) {
    return this.users.update(key, value);
  }

  deleteItem(key: string): void {
    this.users.remove(key);
  }

  login(phoneNumber: any): Observable<any[]> {
    console.log("service starts");

    console.log("service starts");

    return this.db
      .list('/users', (ref) =>
        ref.orderByChild('phoneNumber').equalTo(phoneNumber)
      )
      .valueChanges();
  }

  checkExistingRequested(key: string, phoneNumber: string): Observable<boolean[]> {
    return this.db.list(`/users/${key}/friendRequests`, ref => ref.orderByChild('phoneNumber').equalTo(phoneNumber))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(change => !!change.payload.val());
        })
      );
  }

  checkExistingFriend(key: string, phoneNumber: string): Observable<boolean[]> {
    return this.db.list(`/users/${key}/FriendsList`, ref => ref.orderByChild('phoneNumber').equalTo(phoneNumber))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(change => !!change.payload.val());
        })
      );
  }

  isReqThere(key: string, phoneNumber: string): Observable<any> {
    return this.db.list(`/users/${key}/friendRequests`, ref => ref.orderByChild('phoneNumber').equalTo(phoneNumber))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            const key = c.payload.key;
            const data = { ...(c.payload.val() as any) };
            return { key, ...data };
          });
        })
      );
  }

  isFriendThere(key: string, phoneNumber: string): Observable<any> {
    return this.db.list(`/users/${key}/FriendsList`, ref => ref.orderByChild('phoneNumber').equalTo(phoneNumber))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            const key = c.payload.key;
            const data = { ...(c.payload.val() as any) };
            return { key, ...data };
          });
        })
      );
  }

  sendFriendRequest(key: string, friendRequest: any) {
    return this.db.list(`/users/${key}/friendRequests`).push(friendRequest);
  }

  getFriendRequests(key: string): Observable<any[]> {
    return this.db.list(`/users/${key}/friendRequests`).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const key = c.payload.key;
          const data = { ...(c.payload.val() as any) };
          return { key, ...data };
        });
      })
    );
  }

  getFriends(key: string): Observable<any[]> {
    return this.db.list(`/users/${key}/FriendsList`).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const key = c.payload.key;
          const data = { ...(c.payload.val() as any) };
          return { key, ...data };
        });
      })
    );
  }

  removeFriendRequest(key: string, requestId: string) {
    return this.db.list(`/users/${key}/friendRequests`).remove(requestId);
  }

  removeFriend(key: string, requestId: string) {
    return this.db.list(`/users/${key}/FriendsList`).remove(requestId);
  }

  createFriendsList(key: string, friendRequest: any) {
    return this.db.list(`/users/${key}/FriendsList`).push(friendRequest);
  }

  searchPartial(query: string): Observable<any[]> {
    return this.db.list('/users').snapshotChanges().pipe(
      map(changes => {
        return changes
          .filter(c => {
            const data = c.payload.val() as { nickname: any, phoneNumber: any };
            const nickname = String(data?.nickname || '');
            const phoneNumber = String(data?.phoneNumber || '');
            return (
              nickname.includes(query) ||
              phoneNumber.includes(query)
            );
          })
          .map(c => {
            const key = c.key as string;
            const data = { ...(c.payload.val() as any) };
            return { key, ...data };
          });
      })
    );
  }



  removeFriendRequestByKey(key: string, requestKey: string) {
    return this.db.list(`/users/${key}/friendRequests`).remove(requestKey);
  }


  getFriendRequestInSerderSide(key: string, phoneNumberToFind: string): Observable<any[]> {
    return this.db.list(`/users/${key}/friendRequests`, ref =>
      ref.orderByChild('phoneNumber').equalTo(phoneNumberToFind)
    ).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const key = c.payload.key;
          const data = { ...(c.payload.val() as any) };
          return { key, ...data };
        });
      })
    );

  }

  async checkFriendExists(key: string, phoneNumber: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db
        .list(`/users/${key}/FriendsList`, (ref) =>
          ref.orderByChild('phoneNumber').equalTo(phoneNumber)
        )
        .valueChanges()
        .subscribe((res) => {
          if (res.length === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  async checkRequestExists(key: string, phoneNumber: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db
        .list(`/users/${key}/friendRequests`, (ref) =>
          ref.orderByChild('phoneNumber').equalTo(phoneNumber)
        )
        .valueChanges()
        .subscribe((res) => {
          if (res.length === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  searchFriendListKey(key: string, phoneNumber: string): Observable<any> {
    return this.db.list(`/users/${key}/FriendsList`, ref => ref.orderByChild('phoneNumber').equalTo(phoneNumber))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            const key = c.payload.key;
            const data = { ...(c.payload.val() as any) };
            return { key, ...data };
          });
        })
      );
  }

  updateFriendRequest(key: string, friendKey: string, updatedData: any) {
    const path = `/users/${key}/FriendsList/${friendKey}`;
    this.db.object(path).update(updatedData)
  }

  countMessage(key: string, friendKey: string, updatedData: any) {
    const path = `/users/${key}/FriendsList/${friendKey}`;
    this.db.object(path).update(updatedData)
  }

  getMessages(key: string, pathkey: string): Observable<any[]> {
    return this.db.list(`/users/${key}/FriendsList/${pathkey}/chat`).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const key = c.payload.key;
          const data = { ...(c.payload.val() as any) };
          return { key, ...data };
        });
      })
    );
  }

  sendMessage(key: string, pathkey: string, message: any) {
    return this.db.list(`/users/${key}/FriendsList/${pathkey}/chat`).push(message);
  }

  sendquires(key: string, friendKey: string, updatedData: any) {
    const path = `/users/${key}/FriendsList/${friendKey}`;
    this.db.object(path).update(updatedData)
  }

  changeCount(key: string, friendKey: string,) {
    const path = `/users/${key}/FriendsList/${friendKey}`;
    this.db.object(path).update({ count: 0 })
  }

  async searchIsChatList(key: string, phoneNumber: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db
        .list(`/users/${key}/chats`, (ref) =>
          ref.orderByChild('phoneNumber').equalTo(phoneNumber)
        )
        .valueChanges()
        .subscribe((res) => {
          if (res.length === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  searchChatkey(key: string, phoneNumber: string): Observable<any> {
    return this.db.list(`/users/${key}/chats`, ref => ref.orderByChild('phoneNumber').equalTo(phoneNumber))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            const key = c.payload.key;
            const data = { ...(c.payload.val() as any) };
            return { key, ...data };
          });
        })
      );
  }


  createChatList(key: string, data: any) {
    return this.db.list(`/users/${key}/chats`).push(data);
  }

  updateChatlist(key: string, friendKey: string, updatedData: any) {
    const path = `/users/${key}/chats/${friendKey}`;
    this.db.object(path).update(updatedData)
  }

  getCountValue(key: string, friendKey: string): Observable<any[]> {
    return this.db.list(`/users/${key}/FriendsList/${friendKey}`).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const key = c.payload.key;
          const data = { ...(c.payload.val() as any) };
          return { key, ...data };
        });
      })
    );
  }

  updateMessage(key: string, friendKey: string, chatPath: string, updatedData: any) {
    const path = `/users/${key}/FriendsList/${friendKey}/chat/${chatPath}`;
    this.db.object(path).update(updatedData)
  }

  searchMessageKey(key: string, friendKey: string, currentTime: string): Observable<any> {
    return this.db.list(`/users/${key}/FriendsList/${friendKey}/chat/`, ref => ref.orderByChild('currentTime').equalTo(currentTime))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            const key = c.payload.key;
            const data = { ...(c.payload.val() as any) };
            return { key, ...data };
          });
        })
      );
  }


  setUserOnline(userId: string) {
    this.db.object(`/users/${userId}/online`).set(true);
  }

  setUserOffline(userId: string) {
    // Update the 'online' status to false and set the 'lastSeen' timestamp
    this.db.object(`/users/${userId}`).update({
      //  online: false,
      lastSeen: new Date(), // Set the last seen timestamp
    });
  }

  setUserOfflineByfriend(userId: string) {
    // Update the 'online' status to false and set the 'lastSeen' timestamp
    this.db.object(`/users/${userId}`).update({
      online: false,
      lastSeen: new Date(), // Set the last seen timestamp
    });
  }

  getLastSeen(key: string): Observable<any> {
    return this.db.object(`/users/${key}/lastSeen`).valueChanges();
  }

  getOnline(key: string): Observable<any> {
    return this.db.object(`/users/${key}/online`).valueChanges();
  }

  getNotifications(key: string): Observable<any[]> {
    return this.db.list(`/users/${key}/notification`).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const key = c.payload.key;
          const data = { ...(c.payload.val() as any) };
          return { key, ...data };
        });
      })
    );
  }

  gettingUnreadedNotifications(key: string): Observable<any[]> {  //getting Unreaded Notifications
    return this.db.list(`/users/${key}/unreadnotification`).snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const key = c.payload.key;
          const data = { ...(c.payload.val() as any) };
          return { key, ...data };
        });
      })
    );
  }

  removeUnreadNotification(key: string, requestKey: string) {
    return this.db.list(`/users/${key}/unreadnotification`).remove(requestKey);
  }

  createUnreadNotification(key: string, data: any) {    //create unread notification
    return this.db.list(`/users/${key}/unreadnotification`).push(data);
  }

  createNotification(key: string, data: any) {    //create notification
    return this.db.list(`/users/${key}/notification`).push(data)
  }

  getUserDetails(key: string) {
    return this.db.object(`users/${key}`).snapshotChanges().pipe(
      map(change => {
        const key = change.key;
        const data = { ...(change.payload.val() as any) };
        return { key, ...data };
      })
    );
  }

  updateProfile(key: string, updatedData: any) {
    const path = `/users/${key}`;
    this.db.object(path).update(updatedData)
  }

}






