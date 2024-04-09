import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CouchService {

  CouchURL: string = 'https://192.168.57.185:5984';
  databaseName: string = 'amorchat';
  couchUserName: string = 'd_couchdb';
  couchPassword: string = 'Welcome#2';

  constructor(private http: HttpClient) { }

  getAll() {
    const getAllUrl = `${this.CouchURL}/${this.databaseName}/_all_docs?include_docs=true`;
    return this.http.get(getAllUrl, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    });
  }

  createAccount(document: any) {
    const createUrl = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(createUrl, document, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    });
  }

  checkExistingUser(phoneNumber: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/phoneNumberSearch?key=${phoneNumber}`
    return this.http.get(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    });
  }

  checkExistingUserName(nickName: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/nicknameSearch?key="${nickName}"`
    return this.http.get(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    });
  }

  updateNickName(_id: string,_rev: string, doc: any ) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    }); ``
  }

  createNotification( doc: any ) {
    const createUrl = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(createUrl, doc, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    });
  }

  getNotifications(user_id: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/notificationSearch?key="${user_id}"`;
    return this.http.get(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    });
  }

  //pending
  getContacts(_id: string) {
    const Url = `${this.CouchURL}/${this.databaseName}/_design/contacts/_view/contacts?key=${_id}`
    return this.http.get(Url, {
      headers: {
        'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
      }
    });
  }

}


