import { Injectable } from '@angular/core';
import ImageCompressor from 'image-compressor.js';
@Injectable()
export class BulkResizeService {

  constructor() { }

  imageAdjust(image, width, height, quality) {
    return new Promise((resolve, reject) => {
      var newImage = new Image();
      newImage.src = image.src;
      newImage.width = image.width;
      newImage.height = image.height;
      var resizedImgSrc = this.imageToDataUri(newImage,newImage.width,newImage.height);
      var blob = this.b64toBlob(resizedImgSrc);
      var imageCompressor = new ImageCompressor();
      imageCompressor.compress(blob, {
        quality: quality,
        success(result) {
          var url = window.URL.createObjectURL(result)
          var reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onloadend = function () {
            var url = window.URL.createObjectURL(result)
            resolve(url)
          }
        }
      })
    })

  }

  b64toBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  imageToDataUri(img, width, height) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL();
  }
  
  urlToBlob(url) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'blob';
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function () {
          resolve(reader.result);
        }
      }
      request.send();
    })
  }
}
