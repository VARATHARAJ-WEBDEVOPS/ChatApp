import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoCopyPaste]'
})
export class NoCopyPasteDirective {

  constructor() {}

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    console.log('paste panna mudiyadhu');
  }

  @HostListener('copy', ['$event'])
    onCopy(event: ClipboardEvent) {
    event.preventDefault();
    console.log('copy panna mudiyadhu');
  }
}
