import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private users: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.users = db.list('/users');
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

   sendFriendRequest(key: string, friendRequest: any) {
    return this.db.list(`/users/${key}/friendRequests`).push(friendRequest);
  }



  getFriendRequests(key: string) {
    return this.db.list(`/users/${key}/friendRequests`).valueChanges();
  }

  removeFriendRequest(key: string, requestId: string) {
    return this.db.list(`/users/${key}/friendRequests`).remove(requestId);
  }

  createFriendsList(key: string, friendRequest: any) {
    return this.db.list(`/users/${key}/createFriendsList`).push(friendRequest);
  }
  
 searchPartial(query: string): Observable<any[]> {
  return this.db.list('/users').snapshotChanges().pipe(
    map(changes => {
      return changes
        .filter(c => {
          const key = c.key as string;
          const data = c.payload.val() as { nickname: any, phoneNumber: any }; 
          const nickname = String(data?.nickname || ''); 
          const phoneNumber = String(data?.phoneNumber || ''); 
          return (
            key.includes(query) ||
            nickname.includes(query.toLowerCase()) || 
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

  
  
  
}


