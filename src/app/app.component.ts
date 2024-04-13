import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { CouchService } from './services/couch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

 constructor(private couchService: CouchService) {}

 ngOnInit(): void {
  // this.couchService.callRealtime().subscribe((res: any) => {
  //   console.log(res);
  // })
 }
}
