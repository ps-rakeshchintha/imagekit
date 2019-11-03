import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta,
    private title: Title) { }

  addMetaTags(title, description) {
    //console.log(title, description);

    this.title.setTitle(title);

    this.addTag('description', description);
  }

  addTag(name, content) {
    //console.log(name, content);
    this.meta.addTags([{
      name: name,
      content: content
    }]);
  }

  addOgTags(title, type, url, description, image, width, height) {
    if (title) {
      this.addTag('og:title', title);
    }
    if (description) {
      this.addTag('og:description', description);
    }
    if (url) {
      //this.addTag('og:url', this.domain + url);
    }
    if (image) {
      this.addTag('og:image', image);
      this.addTag('og:image:url', image);
    }
    if (type) {
      this.addTag('og:type', type);
    }
    if (width) {
      this.addTag('og:image:width', width);
    }
    if (height) {
      this.addTag('og:image:height', height);
    }
  }
  addTwitterTags(card, title, description, image) {
    //console.log(card, title, description, image);
    if (card) {
      this.addTag('twitter:card', card);
    }
    if (title) {
      this.addTag('twitter:title', title);
    }
    if (description) {
      this.addTag('twitter:description', description);
    }
    if (image) {
      this.addTag('twitter:image:src', image);
    }
  }
}
