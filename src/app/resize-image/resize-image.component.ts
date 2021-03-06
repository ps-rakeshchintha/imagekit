import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../directives/drag-drop.directive';
import { ImageDataObj } from '../models/image-data';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import { RedirectService } from '../services/redirect.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-resize-image',
  templateUrl: './resize-image.component.html',
  styleUrls: ['./resize-image.component.scss']
})

export class ResizeImageComponent implements OnInit {

  imageFilesData: ImageDataObj[] = [];
  imagesSelected: boolean = false;
  imagesResized: boolean = false;
  imagesResizing: boolean = false;
  filesUploading: boolean = false;
  downloading: boolean = false;
  imageId: number = 0;
  imagesCount: number = 0;

  resizeByValue: string = "percentage";
  maintainAspectRatio: boolean = true;
  maintainMaxSize: boolean = true;
  resizeWidth: number = 100;
  resizeHeight: number = 100;
  globalAspectRatio: number;

  constructor(private redirectService: RedirectService, private seoService: SeoService) {
    this.seoService.addMetaTags("Resize JPEG, PNG, SVG for free", "Resize single or multiple images of JPEG, PNG, SVG and any other image format at once easily and quickly.");
  }

  ngOnInit() {
    const croppedImage: ImageDataObj = this.redirectService.getCropperImageData()
    if (croppedImage) {
      this.redirectService.setCroppedImageData(undefined);
      this.imageFilesData.push(croppedImage);
      this.imagesSelected = true;
      this.imagesCount = 1;
    }
  }

  onFilesSelected(fileInput: any) {
    this.filesUploading = true;
    setTimeout(() => {
      var files = fileInput.target.files;
      files = [...files].filter(s => s.type.includes("image"))
      this.readFiles(files);
    }, 200);
  }

  filesDropped(files: FileHandle[]): void {
    this.filesUploading = true;
    setTimeout(() => {
      this.readFiles(files.map(data => data.file).filter(s => s.type.includes("image")));
    }, 200);
  }

  readFiles(files: File[]) {
    for (const file of files) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event: any) => {
        let image = new Image();
        image.src = _event.target.result;
        image.onload = () => {
          //console.log("The image width is " + this.width + " and image height is " + this.height);
          this.imageId++;
          const imageId = this.imageId;
          const duplicateFileCount: number = this.imageFilesData.filter(img => img.name === file.name).length;
          const duplicateFilePrefix: string = duplicateFileCount > 0 ? `(${duplicateFileCount})` : '';
          const fileNameWithoutPrefix = file.name.split('.').slice(0, -1).join('.');
          const fileName = `${fileNameWithoutPrefix}${duplicateFilePrefix}.${file.name.split('.').pop()}`;
          this.imageFilesData.push({
            id: this.imageId,
            name: fileName,
            url: image.src,
            height: image.height,
            width: image.width,
            resizeWidth: image.width,
            resizeHeight: image.height,
            aspectRatio: image.width / image.height,
            canvasImageSource: image,
            type: file.type
          });
          this.imagesCount = this.imageFilesData.length;
          if (this.imagesSelected) {
            this.calcImageDimensions(this.imageFilesData.filter(img => img.id === imageId)[0], this.resizeWidth ? "width" : "height");
          }
          if (this.imageFilesData.length === files.length && !this.imagesSelected) {
            this.imagesSelected = true;
            this.filesUploading = false;
          }
        };
      }
    }
  }

  removeImage(imageData: ImageDataObj) {
    this.imageFilesData = this.imageFilesData.filter(data => data.id !== imageData.id);
    this.imagesCount--;
    if (this.imagesCount === 0) {
      this.imagesSelected = false;
    }
  }

  hoverImagEnter(imageData: ImageDataObj) {
    imageData.isHovered = true;
  }

  hoverImagLeave(imageData: ImageDataObj) {
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

  resetMaintainSize() {
    this.calcAllImageDimensions(this.resizeWidth ? "width" : "height");
  }

  calcAllImageDimensions(resizeDimension?: string) {
    for (const image of this.imageFilesData) {
      this.calcImageDimensions(image, resizeDimension)
    }
  }

  calcImageDimensions(image: ImageDataObj, resizeDimension?: string) {
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

  goBackToResizeView() {
    this.imagesResized = false;
  }

  downloadImages() {
    this.downloading = true;
    let zip: JSZip = new JSZip();
    const isSingleImage: boolean = this.imageFilesData.length === 1;
    for (const image of this.imageFilesData) {
      const imageUrl = <string>image.resizeUrl;
      if (!isSingleImage) {
        zip.file(image.name, imageUrl.split('base64,')[1], { base64: true })
      } else {
        FileSaver.saveAs(imageUrl, image.name);
        this.downloading = false;
      }
    }
    if (!isSingleImage) {
      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, "download.zip");
        this.downloading = false;
      });
    }
  }

  resizeImages() {
    this.imagesResized = true;
    this.imagesResizing = true;
    setTimeout(() => {
      for (const image of this.imageFilesData) {
        let resize_canvas = document.createElement('canvas');
        resize_canvas.width = image.resizeWidth;
        resize_canvas.height = image.resizeHeight;
        resize_canvas.getContext('2d').drawImage(image.canvasImageSource, 0, 0, image.resizeWidth, image.resizeHeight);
        image.resizeUrl = resize_canvas.toDataURL(image.type)
      }
      this.imagesResizing = false;
    }, 200);
  }

}
