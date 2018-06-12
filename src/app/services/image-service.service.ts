import { Injectable } from '@angular/core';
import Cropper from 'cropperjs';
import * as $ from 'jquery';
@Injectable()
export class ImageCropService {
  width;
  height;
  constructor() {
  }

  previewFile() {
    var img = document.createElement('img');
    var file = (<HTMLInputElement>document.querySelector('input[type=file]')).files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      img.src = reader.result;
      document.body.appendChild(img);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
    else {
      img.src = '';
    }
  }

  getCropper(image, croppable: Boolean) {
    return new Cropper(image, {
      viewMode: 1,
      background: false,
      zoomOnTouch: false,
      zoomOnWheel: false,
      // minCanvasHeight:700,
      // minCanvasWidth: 700,
      minContainerHeight: 700,
      minContainerWidth: 700,
      ready: function () {
        croppable = true;
      },
    });
  }


  drawOutputImage(cropper) {
    var croppedCanvas = cropper.getCroppedCanvas({

    });
    var imageURL = croppedCanvas.toDataURL();
    return imageURL;

  }

  rotateLeft(cropper) {
    var degrees = 0;
    var width = cropper.getCropBoxData().width;
    var height = cropper.getCropBoxData().height;
    if (degrees == 0 || degrees == 180 || degrees == -180) {
      cropper.rotate(-90);
      degrees = degrees - 90;
    }
    else if (degrees == 90 || degrees == -90
      || degrees == 270 || degrees == -270) {
      cropper.rotate(-90);
      degrees = degrees - 90;
    }
  }

  rotateRight(cropper) {
    var degrees = 0;
    var width = cropper.getCropBoxData().width;
    var height = cropper.getCropBoxData().height;
    if (degrees == 0 || degrees == 180 || degrees == -180) {
      cropper.rotate(+90);
      degrees = degrees + 90;
    }
    else if (degrees == 90 || degrees == -90
      || degrees == 270 || degrees == -270) {
      cropper.rotate(+90);
      degrees = degrees + 90;
    }
  }


  flip(cropper, string) {
    var x = cropper.getData().scaleX;
    var y = cropper.getData().scaleY;
    if (string == 'horizontal' && x == 1) {
      cropper.scaleX(-1);
      var x = cropper.getData().scaleX;
    }
    else if (string == 'horizontal' && x == -1) {
      cropper.scaleX(1);
      var x = cropper.getData().scaleX;
    }
    else if (string == 'vertical' && y == -1) {
      cropper.scaleY(1);
      var y = cropper.getData().scaleY;
    }
    else if (string == 'vertical' && y == 1) {
      cropper.scaleY(-1);
      var y = cropper.getData().scaleY;
    }
  }

}
