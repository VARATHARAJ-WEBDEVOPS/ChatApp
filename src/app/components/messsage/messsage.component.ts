import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-messsage',
  templateUrl: './messsage.component.html',
  styleUrls: ['./messsage.component.css']
})
export class MesssageComponent {
  @ViewChild('content') content!: ElementRef;

  scrollToContent() {
    if (this.content && this.content.nativeElement) {
      window.scrollTo(0, this.content.nativeElement.scrollHeight);
    }
  }
}
