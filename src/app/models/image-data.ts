export interface ImageDataObj {
  file?: CanvasImageSource;
  id?: number;
  url: string | ArrayBuffer;
  width: number;
  height: number;
  name: string;
  aspectRatio?: number;
  isHovered?: boolean;
  resizeWidth?: number;
  resizeHeight?: number;
  type: string;
}
