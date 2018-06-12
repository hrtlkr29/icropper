import { Component, OnInit, Input, Output } from '@angular/core';
import * as $ from 'jquery';
import { ImageCropService } from '../services/image-service.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from 'events';
import Cropper from 'cropperjs';
import { PlatformLocation } from '@angular/common'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.css']
})
export class CropImageComponent implements OnInit {
  secondTabFlag: boolean;
  cropper: Cropper;
  fileName: string;
  originSize: string;
  originalPx: string;
  newSize: string;
  newPx: string;
  widthInput: number;
  heightInput: number;
  url: string;
  img: HTMLImageElement;
  // imgFinal: HTMLImageElement;
  flipFlag: boolean;
  rotateFlag: boolean;
  cropFlag: boolean;
  isCropped: boolean;
  originalImg: HTMLImageElement;
  ratioFlag: boolean;
  urlError: boolean;
  cropboxWidth: number;
  cropboxHeight: number;
  downloadLink: string;
  finalImage: HTMLImageElement;
  newWidthInput: number;
  newHeightInput: number;
  constructor(private imageService: ImageCropService, private platformLocation: PlatformLocation, private router: Router,
    private location: Location) {
  }

  ngOnInit() {
    this.urlError = false;
    this.ratioFlag = false;
    this.isCropped = false;

  }

  ngAfterViewInit() {
    this.platformLocation.onPopState(() => {
      console.log('back');
      this.location.go('/image-crop');
    })
  }

  flipDirection(string) {
    this.imageService.flip(this.cropper, string);
  }

  flipBtn() {
    this.cropper.clear();
    this.cropper.enable();
    this.flipFlag = true;
    this.cropFlag = false;
    this.rotateFlag = false;
  }

  rotateLeft() {
    this.imageService.rotateLeft(this.cropper);
  }

  rotateRight() {
    this.imageService.rotateRight(this.cropper);
  }

  rotateBtn() {
    this.rotateFlag = true;
    this.flipFlag = false;
    this.cropFlag = false;
    this.cropper.clear();
    this.cropper.enable();
  }

  applyBtn() {
    let that = this;
    var firstloop = true;
    this.rotateFlag = false;
    this.cropFlag = false;
    this.flipFlag = false;
    var image = <HTMLImageElement>document.querySelector("img");
    var parentNode = image.parentNode;
    this.removeElement(image);
    this.img = new Image();
    this.img.width = this.cropboxWidth;
    this.img.height = this.cropboxHeight;
    this.img.src = this.imageService.drawOutputImage(this.cropper);
    parentNode.appendChild(this.img);
    this.cropper.destroy();
    this.cropper = this.imageService.getCropper(this.img, true);

    this.img.addEventListener('ready',function(){
      this.cropper.clear();
      this.cropper.disable();
    })
    this.img.addEventListener('cropmove', function () {
      var width = that.img.width;
      var height = that.img.height;
      var widthRatio = width / 700;
      var heightRatio = height / 700;
      that.widthInput = (this.cropper.getCropBoxData().width) * widthRatio;
      that.heightInput = (this.cropper.getCropBoxData().height) * heightRatio;
      that.cropboxHeight = this.cropper.getCropBoxData().height;
      that.cropboxWidth = this.cropper.getCropBoxData().width;
    })
    this.finalImage = this.img;
  }

  removeElement(ele) {
    ele.parentNode.removeChild(ele);
  }

  hInput() {
    console.log('change');
    this.cropper.setCropBoxData({
      height: this.heightInput
    })
  }

  wInput() {
    this.cropper.setCropBoxData({
      left: 0,
      top: 0,
      width: this.widthInput
    })
  }

  cropBtn() {
    this.cropFlag = true;
    this.rotateFlag = false;
    this.flipFlag = false;
    this.cropper.enable();
    this.cropper.clear();
  }

  resetBtn() {
    this.cropper.clear();
    this.isCropped = false;
    this.cropper.destroy();
    this.rotateFlag = false;
    this.cropFlag = false;
    this.flipFlag = false;
    var enable = false;
    this.changeInput(enable);
  }

  resizeBtn() {

    var divFinalImage = document.getElementById('put-final-image-here');
    $('#afterLoad').toggle();
    $('#final').toggle();
    // this.imgFinal = new Image();
    // this.imgFinal.src = this.img.src;
    // this.imgFinal.width = 600
    // this.imgFinal.height = 400
    
    this.newSize = this.finalImage.sizes;
    console.log(this.newSize);
    this.newPx = `${Math.round(this.widthInput)} x ${Math.round(this.heightInput)}`;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.img,0,0,this.widthInput,this.heightInput);
    this.downloadLink = canvas.toDataURL()
  }

  saveBtn() {
    var link = document.createElement('a');
    link.setAttribute('href', this.finalImage.src);
    link.setAttribute('download', 'image.jpg');
    link.click();
  }

  firstTabBtn() {
    this.secondTabFlag = false;
  }


  secondTabBtn() {
    this.secondTabFlag = true;
  }

  checkSecondTab() {
    if (this.secondTabFlag == true) {
      return true;
    }
    else return false;
  }

  chooseFile() {
    $('#input').click();
  }


  changeInputToggle() {
    $('#homepage').toggle();
    $('#footer').toggle();
    $('#loader').toggle();
    setTimeout(function () {
      $('#loader').toggle();
      $('#afterLoad').toggle();
      $('#footer').toggle();
    }, 2000);
    var enable = false
    this.changeInput(enable);
  }
  changeInput(enable: boolean) {
    let that = this;
    this.img = <HTMLImageElement>document.querySelector('img,#image');
    this.originalImg = this.img;
    var file = (<HTMLInputElement>document.querySelector('input[type=file],#input')).files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      that.img.src = reader.result;
      var stringFileName = file.name.slice(0, 12);
      that.fileName = `${stringFileName}...`;
      that.originSize = `${Math.round(file.size / 1024)}kB`;
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
    else {
      that.img.src = '';
    }
    this.img.onload = function () {
      var croppable = false;
      that.cropper = that.imageService.getCropper(that.img, croppable);
      that.img.addEventListener('ready', function (event) {
        that.originalPx = `${that.img.width} x ${that.img.height}`;
        that.cropper.clear();
        that.cropper.reset();
        if (enable == true) {
          this.cropper.enable();
        }
        else if (enable == false) {
          that.cropper.disable();
        }

      })
      that.img.addEventListener('cropmove', function (event) {
        var width = that.img.width;
        var height = that.img.height;
        var widtdRatio = width / 700;
        var heightRatio = height / 700;
        that.widthInput = (that.cropper.getCropBoxData().width) * widtdRatio;
        that.heightInput = (that.cropper.getCropBoxData().height) * heightRatio;
        that.cropboxHeight = that.cropper.getCropBoxData().height;
        that.cropboxWidth = that.cropper.getCropBoxData().width;
      });
    }
  }
  OriginRatio() {
    this.ratioFlag = false;
    this.cropper.clear();
    this.cropper.setAspectRatio(0);
  }

  FourThreeRatio() {
    this.ratioFlag = true;
    this.cropper.setAspectRatio(4 / 3);
    this.cropper.clear();
  }

  SixteenNineRatio() {
    this.ratioFlag = true;
    this.cropper.setAspectRatio(16 / 9);
    this.cropper.clear();
  }
  OneOneRatio() {
    this.ratioFlag = true;
    this.cropper.setAspectRatio(1);
    this.cropper.clear();
  }
  urlButton() {
    let that = this;

    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (!(this.url.match(regex))) {
      this.urlError = true;
    }
    setTimeout(function () {
    }, 1000)
    $('#homepage').toggle();
    $('#footer').toggle();
    $('#loader').toggle();
    setTimeout(function () {
      $('#loader').toggle();
      $('#afterLoad').toggle();
      $('#footer').toggle();

    }, 2000);

    var imgSrc = this.url;
    that.img = <HTMLImageElement>document.querySelector('img,#image');
    that.img.src = imgSrc;
    that.img.crossOrigin = '';
    that.img.onload = function () {
      var croppable = false;
      that.cropper = that.imageService.getCropper(that.img, croppable);
      that.img.addEventListener('ready', function (event) {
        that.originalPx = `${that.img.width} x ${that.img.height}`;
        that.cropper.clear();
        that.cropper.disable();
      })
      that.img.addEventListener('cropmove', function (event) {
        that.widthInput = (that.cropper.getCropBoxData().width);
        that.heightInput = (that.cropper.getCropBoxData().height);
      });
    }
  }
}