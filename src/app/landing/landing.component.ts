import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
