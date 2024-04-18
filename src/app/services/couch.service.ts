import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CouchService {

  CouchURL: string = 'https://192.168.57.185:5984';
  databaseName: string = 'amorchat';
  couchUserName: string = 'd_couchdb';
  couchPassword: string = 'Welcome#2';
  header = {
    headers: {
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    }
  }

  constructor(private http: HttpClient) { }

  callRealtime() {
    const realtimeUrl = `${this.CouchURL}/${this.databaseName}/_changes?include_docs=true`;
    return this.http.get(realtimeUrl, this.header);
  }

  //create Process

  createAccount(document: any) {
    const createUrl = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(createUrl, document, this.header);
  }

  sendFriendRequest(doc: any) {
    const Url = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(Url, doc, this.header);
  }

  createContact(doc: any) {
    const Url = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(Url, doc, this.header);
  }

  createNotification(doc: any) {
    const createUrl = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(createUrl, doc, this.header);
  }

  // getUsingAllDocs

  getContactUserDetails(doc: string[]) {
    const url = `${this.CouchURL}/${this.databaseName}/_all_docs?include_docs=true&keys=["${doc}"]`
    return this.http.get(url, this.header);
  }

  //read process

  checkExistingUser(phoneNumber: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/phoneNumberSearch?key=${phoneNumber}`
    return this.http.get(url, this.header);
  }

  checkExistingUserName(nickName: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/nicknameSearch?key="${nickName}"`
    return this.http.get(url, this.header);
  }

  getNotifications(user_id: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/notificationSearch?key="${user_id}"`;
    return this.http.get(url, this.header);
  }

  getContacts(_id: string) {
    const Url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/get_contacts?key="${_id}"`
    return this.http.get(Url, this.header);
  }

  getFriendRequest(user_id: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/friendrequest_search?key="${user_id}"`;
    return this.http.get(url, this.header);
  }

  isReqThere(user_id: string, from_id: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/is_in_requests?key=["${user_id}","${from_id}"]`;
    return this.http.get(url, this.header);
  }

  getContactForDelete(For: string, User: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/search_contact_for_delete?key=["${For}","${User}"]`
    return this.http.get(url, this.header);
  }
    

  //update process

  updateNickName(_id: string, _rev: string, doc: any) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, this.header); ``
  }

  updateUserProfile(_id: string, _rev: string, doc: any) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, this.header); ``
  }

  //delete process...

  cancelFriendRequest(_id: string, _rev: string) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.delete(url, this.header);
  }

  deleteFriend(_id: string, _rev: string) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.delete(url, this.header);
  }

  //search process

  searchUsersByName(name: string) {
    const startkey = name.toLowerCase();
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword)
    });
    return this.http.get(`${this.CouchURL}/${this.databaseName}/_design/view/_view/contactSearch`, {
      headers,
      params: {
        startkey: `"${startkey}"`,
        endkey: `"${startkey}\ufff0"`
      }
    });
  }
}

