import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import ImageCompressor from 'image-compressor.js';
import loadImage from 'image-promise';
import * as uuid from 'uuid';
import Cropper from 'cropperjs';
import { BulkResizeService } from '../services/bulk-resize-service.service';
import { PlatformLocation } from '@angular/common'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-bulk-resize',
  templateUrl: './bulk-resize.component.html',
  styleUrls: ['./bulk-resize.component.css']
})
export class BulkResizeComponent implements OnInit {
  secondTabFlag: boolean;
  originalPixels: string[] = [];
  newPixels: string[] = [];
  files: FileList;
  inputFlag = false;
  proceedFlag = false;
  downloadLinks: string[] = [];
  sizes: any[];
  qualities: any[]
  formats: any[];
  customFlag = false;
  fileList: any[] = [];
  image: HTMLImageElement;
  newImage: HTMLImageElement;
  images: HTMLImageElement[] = [];
  newImages: HTMLImageElement[] = [];
  loaderFlag: boolean;
  count: number;
  originalLinks: string[] = [];
  selectedSize: string;
  selectedQuality: string;
  selectedFormat: string;
  urlLinks: string[] = [];
  urlId: string;
  urlImages: HTMLImageElement[] = [];
  urlIds: string[] = [];
  urlSizes: number[] = []
  urls: string[] = [];
  url: string;
  urlErrorFlag: boolean;
  inputFiles: any[] = [];
  isUrl: boolean;
  onKeyUp: boolean;
  link_resize_url: string[] = [];
  errorFlag: boolean;
  isFileListEmpty: boolean;
  btnChooseFile: HTMLButtonElement;
  inputChooseFile: HTMLInputElement;
  constructor(private imageAdjust: BulkResizeService,private platformLocation: PlatformLocation, private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.isFileListEmpty = false;
    this.selectedSize = 'No change';
    this.selectedQuality = 'Best';
    this.urlErrorFlag = false;
    this.selectedFormat = 'JPG';
    this.loaderFlag = false;
    this.onKeyUp = false;
    this.errorFlag = false;
    this.sizes = ['No change', '25% Smaller', '50% Smaller', '75% Smaller', 'Custom Size'];

    this.qualities = ['Best', 'Better', 'Good'];

    this.formats = ['JPG', 'PNG'];

    this.btnChooseFile = <HTMLButtonElement>document.getElementById('btn-choose-file');
    this.inputChooseFile = <HTMLInputElement>document.getElementById('input');
  }

  ngAfterViewInit(){
    this.platformLocation.onPopState(()=>{
      console.log('back');
      this.location.go('/image-bulk');
    })
  }


  chooseFile() {
    $('#input').click();
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

  chooseSize(value) {
    console.log(this.selectedSize)
    this.newPixels = [];
    this.newImages.forEach((image, index) => {
      var newImage = image;
      if (value == '0: No change') {
        newImage.src = '';
        newImage.width = this.newImages[index].width;
        newImage.height = this.newImages[index].height;
        newImage.src = this.newImages[index].src;
        this.newPixels.push(`${newImage.width} x ${newImage.height}`);
        newImage = new Image();
      }
      else if (value == '1: 25% Smaller') {
        newImage.src = '';
        newImage.width = this.images[index].width * 75 / 100;
        newImage.height = this.images[index].height * 75 / 100;
        newImage.src = this.images[index].src;
        this.newPixels.push(`${newImage.width} x ${newImage.height}`);
        console.log(this.newPixels)
        newImage = new Image();
      }
      else if (value == '2: 50% Smaller') {
        newImage.src = '';
        newImage.width = this.images[index].width * 50 / 100;
        newImage.height = this.images[index].height * 50 / 100;
        newImage.src = this.images[index].src;
        this.newPixels.push(`${newImage.width} x ${newImage.height}`);
        console.log(this.newPixels)
        newImage = new Image();
      }
      else if (value == '3: 75% Smaller') {
        newImage.src = '';
        newImage.width = this.images[index].width * 25 / 100;
        newImage.height = this.images[index].height * 25 / 100;
        newImage.src = this.images[index].src;
        this.newPixels.push(`${newImage.width} x ${newImage.height}`);
        console.log(this.newPixels)
        newImage = new Image();
      }
    })
  }

  chooseQuality(value) {
    console.log(this.selectedQuality)
    var count = 0;
    var that = this;
  }
  onInputType() {
    this.onKeyUp = true;
  }
  changeInput() {
    let that = this;
    this.inputFlag = true;
    this.files = (<HTMLInputElement>document.querySelector('input[type=file],#input')).files
    for (var i = 0; i < this.files.length; i++) {
      this.inputFiles.push(this.files[i])
    
    }
     if(this.inputFiles.length >0){
      this.isFileListEmpty = false;
    }
    else if(this.inputFiles.length ==0){
      this.isFileListEmpty = true;
    }
  }

  resizeBtn() {
    this.loaderFlag = true;
    this.proceedFlag = false;
    $('#loader').toggle();
    $('#footer').toggle();
    setTimeout(function () {
      $('#loader').toggle();
      $('#final').toggle();
    }, 2000);
    this.imageProcessing();
  }

  loadImage(file) {
    this.isUrl = false;
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      var image = new Image();
      reader.onload = function () {
        image.src = reader.result;
      }
      image.onload = function () {
        resolve(image)
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    })
  }

  loadRemoteImage(url) {
    let that = this;
    return new Promise((resolve, reject) => {
      var image = new Image();
      image.onload = async function () {
        if (image) {
          resolve(image)
        }
        else reject();
      }
      var request = new XMLHttpRequest();
      
      request.open('GET', url, true);
      request.responseType = 'blob';
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function () {
          image.src = reader.result
        }
      }

      request.onerror = function (error) {
        reject(error)
      };

      request.send();
      console.log(request.status)
      request.onerror = function (e) {
        console.log('err' + e)
        that.urlErrorFlag = true;
      }
    })
  }

  async proceed() {
    var counter = 0;
    var that = this;
    this.proceedFlag = true;
    $('#homepage').toggle();
    this.fileList = [];
    for (var i = 0; i < this.inputFiles.length; i++) {
      this.fileList.push(this.inputFiles[i]);
    }
    for (var i = 0; i < this.fileList.length; i++) {
      var file = this.fileList[i]
      var img = <HTMLImageElement>await this.loadImage(file)
      var newImg = new Image();
      newImg.src = img.src;
      newImg.width = img.width;
      newImg.height = img.height;
      this.images.push(img)
      this.newImages.push(newImg);
      this.originalPixels.push(`${img.width} x ${img.height}`)
      this.originalLinks.push(img.src);
    }
  }
  downloadImages() {
    this.downloadLinks.forEach((downloadLink, index) => {
      console.log(downloadLink)
      if (this.selectedFormat == 'JPG') {
        var link = document.createElement('a');
        link.setAttribute('href', downloadLink);
        link.setAttribute('download', `image${index}.jpg`);
        link.click();
      }
      else if (this.selectedFormat == 'PNG') {
        var link = document.createElement('a');
        link.setAttribute('href', downloadLink);
        link.setAttribute('download', `image${index}.png`);
        link.click();
      }
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

  addURLs() {
    let that = this;
    this.urlId = uuid.v4();
    //<input type="url" placeholder="http://" name="url" style="border: 0px" [(ngModel)]="url" id="inputUrl">
    var input = document.createElement('input');
    var label = document.createElement('label');
    label.setAttribute('style', 'border: 1px solid #c4c4c4;border-radius: 4px;display:flex;padding: 6px;')
    label.classList.add('input-field');
    input.setAttribute('id', this.urlId);
    input.setAttribute('class', 'inputUrl');
    input.setAttribute('style', 'border:0px; width: -webkit-fill-available;')
    input.onchange = function () {
      console.log('change')
      that.urls.push(input.value);
    }
    input.placeholder = "http://";
    label.appendChild(input)
    $('#add-url-field').append(label);
  }
  deleteRow(index) {
    this.inputFiles.splice(index, 1)
    console.log(this.inputFiles.length)
    if(this.inputFiles.length == 0){
      this.isFileListEmpty = true;
    }
  }

  async proceedUrl() {
    let that = this;
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    this.proceedFlag = true;
    $('#homepage').toggle();
    this.urls.push(this.url)
    if(this.urls == null){
      this.isFileListEmpty = true;
    }
    else if(this.urls != null){
      this.isFileListEmpty = false;
    }
    for (var i = 0; i < this.urls.length; i++) {
      try {
          if(!(this.urls[i].match(regex))){
            this.urlErrorFlag = true;
          }
          var image = <HTMLImageElement>await this.loadRemoteImage(this.urls[i])
          var newImg = new Image();
          image.name = (this.urls[i].substr(this.urls[i].length - 20))
          this.fileList.push(image);
          this.fileList[i].name = image.name;
          this.fileList[i].size = 'Unknown'
          var remote = require('remote-file-size');
          var url = this.urls[i];
          remote(url, function (err, o) {
            that.urlSizes.push(o)
          })
          this.fileList[i].size = this.urlSizes[i];
          newImg.width = image.width;
          newImg.height = image.height;
          newImg.src = image.src;
          this.images.push(image)
          this.newImages.push(newImg);
          this.originalPixels.push(`${image.width} x ${image.height}`)
          this.originalLinks.push(image.src);
      }catch (e) {
        console.log("ERRROR")
      }


    }
  }

  async imageProcessing() {
    this.newImages.forEach(async (image, index) => {
      if (this.selectedQuality == 'Best') {
        if (this.selectedSize == '25% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 75 / 100), (image.height * 75 / 100), 1));
          this.downloadLinks.push(url)
          console.log(this.downloadLinks)
        }
        else if (this.selectedSize == '50% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 50 / 100), (image.height * 50 / 100), 1));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == '75% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 25 / 100), (image.height * 25 / 100), 1));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == 'No change') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, image.width, image.height, 1));
          this.downloadLinks.push(url)
        }
      }
      else if (this.selectedQuality == 'Better') {
        if (this.selectedSize == '25% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 75 / 100), (image.height * 75 / 100), 0.8));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == '50% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 50 / 100), (image.height * 50 / 100), 0.8));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == '75% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 25 / 100), (image.height * 25 / 100), 0.8));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == 'No change') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, image.width, image.height, 0.8));
          this.downloadLinks.push(url)
        }
      }
      else if (this.selectedQuality == 'Good') {
        if (this.selectedSize == '25% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 75 / 100), (image.height * 75 / 100), 0.6));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == '50% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 50 / 100), (image.height * 50 / 100), 0.6));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == '75% Smaller') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, (image.width * 25 / 100), (image.height * 25 / 100), 0.6));
          this.downloadLinks.push(url)
        }
        else if (this.selectedSize == 'No change') {
          var url = <string>(await this.imageAdjust.imageAdjust(image, image.width, image.height, 0.6));
          this.downloadLinks.push(url)
        }
      }
    })
  }
}
