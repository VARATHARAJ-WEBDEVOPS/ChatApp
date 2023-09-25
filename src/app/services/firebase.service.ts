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

  createItem(item: any): void {
    this.users.push(item).then((response) => {
      console.log('Item added successfully with key:', response.key);
    })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  }

  getItems(): Observable<any[]> {
    return this.users.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
    );
  }

  updateItem(key: string, value: any): void {
    this.users.update(key, value);
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
      .valueChanges()
  }
}



