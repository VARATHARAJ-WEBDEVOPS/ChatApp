import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(400)),
    ]),
    trigger('progressBarWidth', [
      state('0', style({ width: '100%' })),
      state('100', style({ width: '0%' })),
      transition('0 => 100', animate('2s ease-in-out')),
    ]),
  ],

})
export class ToastComponent {
  constructor(private toastService: ToastService) {}

  get show() {
    return this.toastService.show;
  }

  get success() {
    return this.toastService.success;
  }

  get error() {
    return this.toastService.error;
  }

  get message() {
    return this.toastService.message;
  }

  get progressWidth() {
    return this.toastService.progressWidth;
  }

  hideToast() {
    this.toastService.hideToast();
  }
}
