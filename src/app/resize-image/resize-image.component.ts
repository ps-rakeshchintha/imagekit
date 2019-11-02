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
          that.imageFilesData.push({
            id: that.imageId,
            name: file.name,
            url: image.src,
            height: this.height,
            width: this.width,
            resizeWidth: this.width,
            resizeHeight: this.height,
            aspectRatio: this.width / this.height
          });
          that.imagesCount = that.imageFilesData.length;
          if (that.imageFilesData.length === files.length && !that.imagesSelected) {
            that.imagesSelected = true;
          }
          //console.log(that.imageFilesData);

        };
      }
    }
  }

  removeImage(imageData: ImageData) {
    this.imageFilesData = this.imageFilesData.filter(data => data.id !== imageData.id)
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
    } else if (this.imagesCount === 1 && this.resizeByValue === "pixels") {
      this.resizeWidth = this.imageFilesData[0].width;
      this.resizeHeight = this.imageFilesData[0].height;
      this.globalAspectRatio = this.resizeWidth / this.resizeHeight;
    }
    this.calculateResizeDimensions();
  }

  resizeWidthChanged() {
    if (this.maintainAspectRatio) {
      if (this.resizeByValue === "percentage") {
        this.resizeHeight = this.resizeWidth;
      } else if (this.resizeByValue === "pixels") {
        if (this.imagesCount === 1) {
          this.resizeHeight = Math.floor(this.resizeWidth / this.globalAspectRatio);
        }
      }
    }
    this.calculateResizeDimensions();
  }

  resizeHeightChanged() {
    if (this.maintainAspectRatio) {
      if (this.resizeByValue === "percentage") {
        this.resizeWidth = this.resizeHeight;
      } else if (this.resizeByValue === "pixels") {
        if (this.imagesCount === 1) {
          this.resizeWidth = Math.floor(this.globalAspectRatio * this.resizeHeight);
        }
      }
    }
    this.calculateResizeDimensions();
  }

  calculateResizeDimensions() {
    for (const image of this.imageFilesData) {
      if (this.resizeByValue === "percentage") {
        image.resizeWidth = Math.floor((this.resizeWidth * image.width) / 100);
        image.resizeHeight = Math.floor((this.resizeHeight * image.height) / 100);
      } else if (this.resizeByValue === "pixels") {
        image.resizeWidth = this.resizeWidth;
        image.resizeHeight = this.resizeHeight;
      }
    }
  }

}
