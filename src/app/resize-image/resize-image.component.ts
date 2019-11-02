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
  imagesCount: number = 0;

  resizeByValue: string = "percentage";
  maintainAspectRatio: boolean = true;
  maintainMaxSize: boolean = true;
  resizeWidth: number = 100;
  resizeHeight: number = 100;

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
          that.imagesCount++;
          that.imageFilesData.push({
            id: that.imagesCount,
            name: file.name,
            url: image.src,
            height: this.height,
            width: this.width,
            resizeWidth: this.width,
            resizeHeight: this.height,
            aspectRatio: this.width / this.height
          });
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
  }

  resizeWidthChanged() {
  }

  resizeHeightChanged() {
  }

  calculateResizeDimensions() {

  }

  restResize() {
  }

}
