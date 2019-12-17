import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  statsCounter = {
    resized: 24560,
    cropped: 12346
  }
  constructor(private seoService: SeoService) {
    this.seoService.addMetaTags("Free Image Editing Tools", "Edit your images for free quickly with simple tools without having to worry about privacy concerns.");
  }

  ngOnInit() {
  }

}
