import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
      'Authorization': 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword),
      'Content-Type': 'multipart/form-data'
    }
  }

  constructor(private http: HttpClient) { }



  createAccount(document?: any) {
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

  createChat(doc: any) {
    const createUrl = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(createUrl, doc, this.header);
  }

  createGroupChat(doc: any) {
    const createUrl = `${this.CouchURL}/${this.databaseName}`;
    return this.http.post(createUrl, doc, this.header);
  }



  getContactUserDetails(doc: string[]) {
    const url = `${this.CouchURL}/${this.databaseName}/_all_docs?include_docs=true&keys=["${doc}"]`
    return this.http.get(url, this.header);
  }

  getGroup(doc: string[]) {
    const url = `${this.CouchURL}/${this.databaseName}/_all_docs?include_docs=true&keys=["${doc}"]`
    return this.http.get(url, this.header);
  }

  getPeoples(doc: string[]) {
    const url = `${this.CouchURL}/${this.databaseName}/_all_docs?include_docs=true&keys=["${doc}"]`
    return this.http.get(url, this.header);
  }



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

  getGroups(_id: string) {
    const Url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/get_group?key="${_id}"`
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

  getChat(user: string, _with: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/get_chats?key=["${user}","${_with}"]`
    return this.http.get(url, this.header);
  }

  getGroupChat(group: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/get_group_chats?key="${group}"`
    return this.http.get(url, this.header);
  }

  findIsFriendReq(user: string) {
    const url = `${this.CouchURL}/${this.databaseName}/_design/view/_view/findIsFriend?key="${user}"&include_docs=true`
    return this.http.get(url, this.header);
  }



  updateNickName(_id: string, _rev: string, doc: any) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, this.header);
  }

  updateUserProfile(_id: string, _rev: string, doc: any) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, this.header);
  }

  updateGroup(_id: string, _rev: string, doc: any) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, this.header);
  }

  updatecontact(_id: string, _rev: string, doc: any) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, this.header);
  }

  pushGroupIdToUSerData(_id: string, _rev: string, doc: any) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.put(url, doc, this.header);
  }



  cancelFriendRequest(_id: string, _rev: string) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.delete(url, this.header);
  }

  deleteFriend(_id: string, _rev: string) {
    const url = `${this.CouchURL}/${this.databaseName}/${_id}?rev=${_rev}`;
    return this.http.delete(url, this.header);
  }



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


  callRealtime(id: string): Observable<any> {
    const realtimeUrl = `${this.CouchURL}/${this.databaseName}/_changes?include_docs=true&filter=mydesign/myfilter&user=${id}`  
    return this.http.get(realtimeUrl, {
      headers: {
        "Authorization": 'Basic ' + btoa(this.couchUserName + ':' + this.couchPassword),
        "Accept": 'application/json',
        "Content-Type": 'application/json',
      }
    });
  }

  uploadFiles(files: File) {

    let basic = "Basic " + btoa(`${this.couchUserName}:${this.couchPassword}`);

    let headers = new HttpHeaders({
      'Content-Type': files.type,
      'Authorization': basic,
    });

    let options = { headers: headers };

    return this.http.put(`${this.CouchURL}/${this.databaseName}/${uuidv4()}/${files.name}`, files, options)
  }
}

