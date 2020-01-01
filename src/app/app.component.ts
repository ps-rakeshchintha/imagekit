import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from "@angular/common";

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

  constructor(breakpointObserver: BreakpointObserver, router: Router, @Inject(DOCUMENT) private document: Document) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.showMobileMenuIcon = result.matches ? true : false;
    });
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.currentRoute !== router.url) {
        this.showMobileMenu = false;
        this.currentRoute = router.url;
        const link = <HTMLLinkElement>this.document.head.querySelector("link[rel='canonical']")
          || this.document.head.appendChild(this.document.createElement("link"));
        link.rel = "canonical";
        link.href = this.getCanonicalUrl();
      }
    });
  }

  getCanonicalUrl() {
    let href: string;
    switch (this.currentRoute) {
      case "/crop-image":
        href = "https://easyimgedit.com/crop-image"
        break;
      case "/resize-image":
        href = "https://easyimgedit.com/resize-image"
        break;
      case "/compress-jpg":
        href = "https://easyimgedit.com/compress-jpg"
        break;
      case "/404":
        href = "https://easyimgedit.com/404"
        break;

      default:
        href = "https://easyimgedit.com/"
        break;
    }
    return href;
  }

  menuClick() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
