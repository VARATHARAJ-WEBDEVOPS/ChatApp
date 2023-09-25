import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgToastService } from 'ng-angular-popup';
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

  userName!: string;
  phoneNumber!: string;
  password!: string;
  addItemForm!: FormGroup;
  showError: boolean = false;
  showErrorPhnNO: boolean = false;
  showErrorUserName: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private db: AngularFireDatabase,
    private title: Title,
    public toast: NgToastService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.title.setTitle("AmorChat | Signup");
    this.addItemForm = this.fb.group({
      userName: [''],
      phoneNumber: [''],
      password: ['']
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
    this.toastService.showToast('Signup successful', true);
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
          this.toastService.showToast('Already a user', false);
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

    if (this.userName == null) {
      this.showErrorUserName = true;
    }

    if (this.phoneNumber == null || !phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorPhnNO = true;
    }

    if (!this.password) {
      this.showError = true;
    }

    if (this.userName && this.phoneNumber && this.password && phoneNumberPattern.test(this.phoneNumber)) {
      this.showErrorUserName = false;
      this.showErrorPhnNO = false;
      this.showError = false;
      this.checkUserExistence();
    }
  }


}
