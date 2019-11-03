import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../directives/drag-drop.directive';
import { ImageData } from '../models/image-data';

@Component({
  selector: 'app-resize-image',
  templateUrl: './resize-image.component.html',
  styleUrls: ['./resize-image.component.scss']
})

export class ResizeImageComponent implements OnInit {

  imageFilesData: ImageData[] = [];
  imagesSelected: boolean = false;
  imageId: number = 0;
  imagesCount: number = 0;

  resizeByValue: string = "percentage";
  maintainAspectRatio: boolean = true;
  maintainMaxSize: boolean = true;
  resizeWidth: number = 100;
  resizeHeight: number = 100;
  globalAspectRatio: number;

  constructor() { }

  ngOnInit() {
  }

  onFilesSelected(fileInput: any) {
    var files = fileInput.target.files;
    files = [...files].filter(s => s.type.includes("image"))
    this.readFiles(files);
  }

  filesDropped(files: FileHandle[]): void {
    this.readFiles(files.map(data => data.file).filter(s => s.type.includes("image")));
  }

  readFiles(files: File[]) {
    for (const file of files) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event: any) => {
        let image;
        image = new Image();
        image.src = _event.target.result;
        let that = this;
        image.onload = function () {
          //console.log("The image width is " + this.width + " and image height is " + this.height);
          that.imageId++;
          const imageId = that.imageId;
          that.imageFilesData.push({
            id: that.imageId,
            name: file.name,
            url: image.src,
            height: this.height,
            width: this.width,
            resizeWidth: this.width,
            resizeHeight: this.height,
            aspectRatio: this.width / this.height,
            file: image
          });
          that.imagesCount = that.imageFilesData.length;
          if (that.imagesSelected) {
            that.calcImageDimensions(that.imageFilesData.filter(img => img.id === imageId)[0], that.resizeWidth ? "width" : "height");
          }
          if (that.imageFilesData.length === files.length && !that.imagesSelected) {
            that.imagesSelected = true;
          }
          //console.log(that.imageFilesData);

        };
      }
    }
  }

  removeImage(imageData: ImageData) {
    this.imageFilesData = this.imageFilesData.filter(data => data.id !== imageData.id);
    this.imagesCount--;
    if (this.imagesCount === 0) {
      this.imagesSelected = false;
    }
  }

  hoverImagEnter(imageData: ImageData) {
    imageData.isHovered = true;
  }

  hoverImagLeave(imageData: ImageData) {
    imageData.isHovered = false;
  }

  resizeTypeChanged() {
    if (this.resizeByValue === "percentage") {
      this.resizeWidth = 100;
      this.resizeHeight = 100;
    } else if (this.resizeByValue === "pixels") {
      if (this.imagesCount === 1) {
        this.resizeWidth = this.imageFilesData[0].width;
        this.resizeHeight = this.imageFilesData[0].height;
        this.globalAspectRatio = this.resizeWidth / this.resizeHeight;
      } else {
        this.resizeWidth = null;
        this.resizeHeight = null;
        this.globalAspectRatio = null;
      }
    }
    this.calcAllImageDimensions();
  }

  resizeWidthChanged() {
    if (this.maintainAspectRatio) {
      if (this.resizeByValue === "percentage") {
        this.resizeHeight = this.resizeWidth;
      } else if (this.resizeByValue === "pixels") {
        if (this.imagesCount === 1) {
          this.resizeHeight = Math.floor(this.resizeWidth / this.globalAspectRatio);
        } else {
          this.resizeHeight = null;
        }
      }
    }
    this.calcAllImageDimensions("width");
  }

  resizeHeightChanged() {
    if (this.maintainAspectRatio) {
      if (this.resizeByValue === "percentage") {
        this.resizeWidth = this.resizeHeight;
      } else if (this.resizeByValue === "pixels") {
        if (this.imagesCount === 1) {
          this.resizeWidth = Math.floor(this.globalAspectRatio * this.resizeHeight);
        } else {
          this.resizeWidth = null;
        }
      }
    }
    this.calcAllImageDimensions("height");
  }

  resetMaintainSize(){
    this.calcAllImageDimensions(this.resizeWidth ? "width" : "height");
  }

  calcAllImageDimensions(resizeDimension?: string) {
    for (const image of this.imageFilesData) {
      this.calcImageDimensions(image, resizeDimension)
    }
  }

  calcImageDimensions(image: ImageData, resizeDimension?: string) {
    if (this.resizeByValue === "percentage") {
      image.resizeWidth = Math.floor((this.resizeWidth * image.width) / 100);
      image.resizeHeight = Math.floor((this.resizeHeight * image.height) / 100);
    } else if (this.resizeByValue === "pixels") {
      if (this.maintainAspectRatio && resizeDimension) {
        if (resizeDimension === "width") {
          image.resizeWidth = this.resizeWidth || image.width;
          image.resizeHeight = Math.floor(image.resizeWidth / image.aspectRatio);
        } else if (resizeDimension === "height") {
          image.resizeHeight = this.resizeHeight || image.height;
          image.resizeWidth = Math.floor(image.resizeHeight * image.aspectRatio);
        }
      } else {
        image.resizeWidth = this.resizeWidth || image.width;
        image.resizeHeight = this.resizeHeight || image.height;
      }
    }
    if (this.maintainMaxSize && (image.resizeHeight > image.height || image.resizeWidth > image.width)) {
      image.resizeWidth = image.width;
      image.resizeHeight = image.height;
    }
  }

  resizeImages() {
    for (const image of this.imageFilesData) {
      let resize_canvas = document.createElement('canvas');
      resize_canvas.width = image.resizeWidth;
      resize_canvas.height = image.resizeHeight;
      resize_canvas.getContext('2d').drawImage(image.file, 0, 0, image.resizeWidth, image.resizeHeight);
      //$(image_target).attr('src', resize_canvas.toDataURL("image/png"));
    }
  }

}
