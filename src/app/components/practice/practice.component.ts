import { Component } from '@angular/core';
import { CouchService } from 'src/app/services/couch.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent {
  fileToUpload!: File;
  selectedImage!: File;
  fileData!: File;

  constructor(private service: CouchService) { }

  selectedSendFile(event: any) {
    this.selectedImage = <File>event.target.files[0];
    console.log(this.selectedImage);
  }

  sendImage() {
    if (this.selectedImage) {
      this.service.uploadFiles(this.selectedImage).subscribe((res: any) => {
        console.log(res);
      })
    }
  }

}
