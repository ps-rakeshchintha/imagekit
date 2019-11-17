import { SafeUrl } from '@angular/platform-browser';

export interface ImageDataObj {
  canvasImageSource?: CanvasImageSource;
  id?: number;
  url?: string | ArrayBuffer | SafeUrl;
  width?: number;
  height?: number;
  name?: string;
  type?: string;
  size?: number;
  prettySize?: string;
  file?: File;
  aspectRatio?: number;
  isHovered?: boolean;
  resizeWidth?: number;
  resizeHeight?: number;
  resizeUrl?: string | ArrayBuffer | SafeUrl;
  compressUrl?: string | ArrayBuffer | SafeUrl;
  compressSize?: number;
  compressPrettySize?: string;
}
