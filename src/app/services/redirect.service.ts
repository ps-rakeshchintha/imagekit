import { Injectable } from '@angular/core';
import { ImageDataObj } from '../models/image-data';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  croppedImageData: ImageDataObj;

  constructor() { }

  setCroppedImageData(data: ImageDataObj){
    this.croppedImageData = data
  }

  getCropperImageData(): ImageDataObj{
    return this.croppedImageData;
  }
}
