import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss']
})
export class CropImageComponent implements OnInit {

  //page state variables
  imageSelected: boolean = false;
  imageCropped: boolean = false;

  //image data
  imageFileData: File = null;
  imageUrl: string | ArrayBuffer;

  //cropped image data
  croppedImageUrl: string;
  croppedImageWidth: number;
  croppedImageHeight: number;

  // crop image options
  aspectRatio: number = -1;
  cropper: Cropper;
  isFlippedVertical: boolean = false;
  isFlippedHorizontal: boolean = false;

  @ViewChild('imgTarget', { static: false }) imgTarget: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onFileSelected(fileInput: any) {
    this.imageFileData = <File>fileInput.target.files[0];
    console.log(this.imageFileData);
    var mimeType = this.imageFileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.imageFileData);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
      this.imageSelected = true;
      this.changeDetectorRef.detectChanges();
      this.initializeCropper();
    }
  }

  initializeCropper() {
    this.cropper = new Cropper(this.imgTarget.nativeElement, {
      initialAspectRatio: 16 / 9,
      zoomOnWheel: false,
      zoomOnTouch: false,
      crop(event) {
        console.log(event.detail.x);
        console.log(event.detail.y);
        console.log(event.detail.width);
        console.log(event.detail.height);
        console.log(event.detail.rotate);
        console.log(event.detail.scaleX);
        console.log(event.detail.scaleY);
      },
    });
  }

  aspectRatioChanged() {
    this.cropper.setAspectRatio(this.aspectRatio);
  }

  flipVertical() {
    this.isFlippedVertical = !this.isFlippedVertical;
    this.cropper.scaleY(this.isFlippedVertical ? -1 : 1);
  }

  flipHorizontal() {
    this.isFlippedHorizontal = !this.isFlippedHorizontal;
    this.cropper.scaleX(this.isFlippedHorizontal ? -1 : 1);
  }

  zoomOut() {
    this.cropper.zoom(-0.1);
  }

  zoomIn() {
    this.cropper.zoom(0.1);
  }

  setDragMode(mode: Cropper.DragMode) {
    this.cropper.setDragMode(mode);
  }

  rotate(deg: number) {
    this.cropper.rotate(deg);
  }

  cropImage() {
    const canvas = this.cropper.getCroppedCanvas({
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high'
    });
    const cropBoxData = this.cropper.getData();
    this.croppedImageWidth = Math.floor(cropBoxData.width);
    this.croppedImageHeight = Math.floor(cropBoxData.height);
    this.croppedImageUrl = canvas.toDataURL(this.imageFileData.type);
    this.imageCropped = true;
  }
}
