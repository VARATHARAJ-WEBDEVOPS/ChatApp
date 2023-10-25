import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  constructor(private router: Router , private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle("AmorChat | Splashscreen");
    setTimeout(() => {
     this.router.navigateByUrl('signup');
    }, 2000); 
  }

}
