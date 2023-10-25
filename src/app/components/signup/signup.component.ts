import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastService } from 'src/app/services/toast.service';
import { Title } from '@angular/platform-browser';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],

})
export class SignupComponent implements OnInit, OnDestroy {

  userName: string = "";
  phoneNumber: string = "";
  password: string = "";
  addItemForm!: FormGroup;
  showError: boolean = false;
  showErrorPhnNO: boolean = false;
  showErrorUserName: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private db: AngularFireDatabase,
    private title: Title,
    private toastService: ToastService,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private renderer: Renderer2) {
  }

  changeUpper() {
    this.userName = this.userName.toLowerCase();
  }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | Signup");
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('chat');
    }
    this.addItemForm = this.fb.group({
      userName: [''],
      phoneNumber: [''],
      password: [''],
    });

  }

  navigate() {
    this.router.navigateByUrl('/login');
  }

  onSubmit() {
    this.addItemForm.value.userName = this.userName;
    this.addItemForm.value.phoneNumber = this.phoneNumber;
    this.addItemForm.value.password = this.password;
    this.firebaseService.createItem(this.addItemForm.value)
    localStorage.setItem('token', this.phoneNumber);
    this.router.navigateByUrl("chat");
  }

  checkUserExistence() {
    const usersRef = this.db.list('users', (ref) =>
      ref.orderByChild('phoneNumber').equalTo(this.phoneNumber)
    );

    const users$: Observable<any[]> = usersRef.valueChanges();

    users$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((users) => {
        console.log(users);

        if (users.length > 0) {
          this.toastService.showToast('Phone Number Already userd', true);
          this.phoneNumber = '';
          this.showErrorPhnNO = true;
        } else {
          console.log('User does not exist');
          this.onSubmit();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  validation() {
    this.showErrorUserName = false;
    this.showErrorPhnNO = false;
    this.showError = false;

    const phoneNumberPattern = /^[0-9]{10}$/;
    const hasNumbersOrSymbols = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(this.password);
    const hasNumbersOrSymbolsForUserName = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(this.userName);

    if (!this.userName) {
      this.showErrorUserName = true;
    } else if (hasNumbersOrSymbolsForUserName) {
      this.showErrorUserName = true;
      this.toastService.showToast('Symbols & Numbers Not Allowed for UserName', true);
    } else if (this.userName && this.userName.length < 4) {
      this.showErrorUserName = true;
      this.toastService.showToast('( User Name ) Need Atleast 4 charecters', true);
    } else if (!this.phoneNumber) {
      this.showErrorPhnNO = true;
    } else if (!phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorPhnNO = true;
      this.toastService.showToast('Invalid Phone Number', true);
    } else if (!this.password) {
      this.showError = true;
    } else if (this.password.length < 8) {
      this.showError = true;
      this.toastService.showToast('( Password ) Need Atleast 8 characters', true);
    } else if (hasNumbersOrSymbols) {
      this.showError = true;
      this.toastService.showToast('Symbols & Numbers Not Allowed', true);
    }else if (this.userName  && this.phoneNumber && this.password && phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorUserName = false;
      this.showErrorPhnNO = false;
      this.showError = false;
      this.checkUserExistence();
    }
  }


}
