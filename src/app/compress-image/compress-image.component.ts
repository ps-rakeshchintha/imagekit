import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ImageDataObj } from '../models/image-data';
import { FileHandle } from '../directives/drag-drop.directive';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import Compressor from 'compressorjs';

import { RedirectService } from '../services/redirect.service';
import { SeoService } from '../services/seo.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-compress-jpg',
  templateUrl: './compress-image.component.html',
  styleUrls: ['./compress-image.component.scss']
})
export class CompressImageComponent implements OnInit {

  imageFilesData: ImageDataObj[] = [];
  imagesSelected: boolean = false;
  imagesCompressed: boolean = false;
  imageId: number = 0;
  imagesCount: number = 0;
  compressedImageCount: number = 0;
  compressQualityValue: number = 0.7;

  constructor(private redirectService: RedirectService, private seoService: SeoService, private sanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) {
    this.seoService.addMetaTags("Compress JPEG", "Compress any JPEGs by selecting the quality target as per required size.");
  }

  ngOnInit() {
    const compressImage: ImageDataObj = this.redirectService.getCropperImageData()
    if (compressImage) {
      this.redirectService.setCroppedImageData(undefined);
      this.imageFilesData.push(compressImage);
      this.imagesSelected = true;
      this.imagesCount = 1;
    }
  }

  onFilesSelected(fileInput: any) {
    var files = fileInput.target.files;
    files = [...files].filter(s => s.type.includes("image"));
    this.readFiles(files);
  }

  filesDropped(files: FileHandle[]): void {
    this.readFiles(files.map(data => data.file).filter(s => s.type.includes("image/jpeg")));
  }
  readFiles(files: File[]) {
    for (const file of files) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event: any) => {
        this.imageId++;
        const duplicateFileCount: number = this.imageFilesData.filter(img => img.name === file.name).length;
        const duplicateFilePrefix: string = duplicateFileCount > 0 ? `(${duplicateFileCount})` : '';
        const fileNameWithoutPrefix = file.name.split('.').slice(0, -1).join('.');
        const fileName = `${fileNameWithoutPrefix}${duplicateFilePrefix}.${file.name.split('.').pop()}`;
        const imageData: ImageDataObj = {
          id: this.imageId,
          name: fileName,
          type: file.type,
          url: _event.target.result,
          size: file.size,
          prettySize: this.prettySize(file.size),
          file: file
        }
        this.imageFilesData.push(imageData);
        this.imagesCount = this.imageFilesData.length;
        if (this.imagesSelected) {
          this.compressImage(imageData)
        }
        if (this.imageFilesData.length === files.length && !this.imagesSelected) {
          this.imagesSelected = true;
          this.compressImages();
        }
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

  prettySize(size: number) {
    var kilobyte = 1024;
    var megabyte = kilobyte * kilobyte;

    if (size > megabyte) {
      return (size / megabyte).toFixed(2) + ' MB';
    } else if (size > kilobyte) {
      return (size / kilobyte).toFixed(2) + ' KB';
    } else if (size >= 0) {
      return size + ' B';
    }

    return 'N/A';
  }

  compressImages() {
    for (const image of this.imageFilesData) {
      this.compressImage(image);
    }
  }

  compressImage(image: ImageDataObj) {
    new Compressor(image.file, {
      quality: this.compressQualityValue,
      convertSize: 1,
      success: (result) => {
        var reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = (_event: any) => {
          image.compressUrl = _event.target.result;
          image.compressSize = result.size;
          image.compressPrettySize = this.prettySize(result.size);
          this.compressedImageCount++;
          this.changeDetectorRef.detectChanges();
          if (this.compressedImageCount === this.imageFilesData.length) {
            console.log("refreshed");
          }
        }
      }
    })
  }

  sliderOnChange(value: number) {
    if (this.compressQualityValue !== value) {
      this.compressQualityValue = value / 100;
      this.compressedImageCount = 0;
      this.compressImages();
    }
  }

  compressImagesDone() {
    this.imagesCompressed = true;
  }

  goBackToCompressView() {
    this.imagesCompressed = false;
  }

  downloadImages() {
    let zip: JSZip = new JSZip();
    const isSingleImage: boolean = this.imageFilesData.length === 1;
    for (const image of this.imageFilesData) {
      const imageUrl = <string>image.compressUrl;
      if (!isSingleImage) {
        zip.file(image.name, imageUrl.split('base64,')[1], { base64: true })
      } else {
        FileSaver.saveAs(imageUrl, image.name);
      }
    }
    if (!isSingleImage) {
      zip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, "download.zip");
      });
    }
  }

}
