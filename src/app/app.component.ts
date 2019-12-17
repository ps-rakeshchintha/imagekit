import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Easy Img Edit';
  showMobileMenu: boolean;
  showMobileMenuIcon: boolean;
  currentRoute: string;

  constructor(breakpointObserver: BreakpointObserver, router : Router) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.showMobileMenuIcon = result.matches ? true : false;
    });
    router.events.subscribe(val => {
      if(this.currentRoute !== router.url){
        this.showMobileMenu = false;
        this.currentRoute = router.url;
      }
    });
  }

  menuClick(){
    this.showMobileMenu = !this.showMobileMenu;
  }
}
