import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteService implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    } else {
      return this.router.parseUrl('/login');
    }
  }
}