import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  show = false;
  success = false;
  error = false;
  message = '';
  progressWidth = 100; 

  showToast(message: string, success: boolean = true) {
    this.show = true;
    this.success = success;
    this.error = !success;
    this.message = message;

    this.progressWidth = 100; 

    setTimeout(() => {
      this.hideToast();
    }, 3000); 
  }

  hideToast() {
    this.show = false;
  }
}
