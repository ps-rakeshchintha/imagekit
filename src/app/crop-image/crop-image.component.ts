import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import Cropper from 'cropperjs';
import { FileHandle } from '../directives/drag-drop.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { ImageDataObj } from '../models/image-data';

import { RedirectService } from '../services/redirect.service';

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
  croppedCanvas: CanvasImageSource;

  // crop image options
  aspectRatio: number = -1;
  cropper: Cropper;
  isFlippedVertical: boolean = false;
  isFlippedHorizontal: boolean = false;
  sliderValue: number = 0;

  @ViewChild('imgTarget', { static: false }) imgTarget: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef, private _snackBar: MatSnackBar, private router: Router, private redirectService: RedirectService) { }

  ngOnInit() {
  }

  onFileSelected(fileInput: any) {
    this.imageFileData = <File>fileInput.target.files[0];
    this.readFile();
  }

  filesDropped(files: FileHandle[]): void {
    if (files.length > 1) {
      this._snackBar.open("You have selected more than one file. Cropping an image only support one file at a time for now.", "Dismiss", {
        duration: 3000,
      });
    }
    this.imageFileData = <File>files[0].file;
    this.readFile();
  }

  readFile() {
    //console.log(this.imageFileData);
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
      crop(event) {
        // console.log(event.detail.x);
        // console.log(event.detail.y);
        // console.log(event.detail.width);
        // console.log(event.detail.height);
        // console.log(event.detail.rotate);
        // console.log(event.detail.scaleX);
        // console.log(event.detail.scaleY);
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

  sliderOnChange(value: number) {
    if (this.sliderValue !== value) {
      this.sliderValue = value;
      this.cropper.rotateTo(value);
    }
  }

  cropImage() {
    this.croppedCanvas = this.cropper.getCroppedCanvas({
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high'
    });
    const cropBoxData = this.cropper.getData();
    this.croppedImageWidth = Math.floor(cropBoxData.width);
    this.croppedImageHeight = Math.floor(cropBoxData.height);
    this.croppedImageUrl = this.croppedCanvas.toDataURL(this.imageFileData.type);
    this.imageCropped = true;
  }

  goBackToCropView() {
    this.imageCropped = false;
    this.changeDetectorRef.detectChanges();
    this.initializeCropper();
  }

  downloadImage() {
    FileSaver.saveAs(this.croppedImageUrl, this.imageFileData.name);
  }

  goToResizePage() {
    const imageData: ImageDataObj = {
      file : this.croppedCanvas,
      width : this.croppedImageWidth,
      height: this.croppedImageHeight,
      resizeWidth : this.croppedImageWidth,
      resizeHeight: this.croppedImageHeight,
      url: this.croppedImageUrl,
      type: this.imageFileData.type,
      name: this.imageFileData.name,
      id: 1,
      aspectRatio: this.croppedImageWidth/this.croppedImageHeight
    }
    this.redirectService.setCroppedImageData(imageData)
    this.router.navigate(['/resize-image']);
  }
}
