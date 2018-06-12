import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import ImageCompressor from 'image-compressor.js';
import * as uuid from 'uuid';
import { PlatformLocation } from '@angular/common'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-compress-image',
  templateUrl: './compress-image.component.html',
  styleUrls: ['./compress-image.component.css']
})
export class CompressImageComponent implements OnInit {
  secondTabFlag: boolean;
  img: HTMLImageElement;
  results: Blob[] = [];
  resultFlag: boolean = false;
  status: string = "Ready";
  files: FileList;
  fileName: string;
  fileSize: number;
  fileNames: string[] = [];
  fileSizes: number[] = [];
  resultSizes: number[] = [];
  resultSize: number;
  saveList: number[] = [];
  id: string;
  urlId: string;
  urls: string[] = [];
  fileList: any[] = [];
  proceedFlag: boolean;
  inputFlag = false;
  downloadLinks: any[] = [];
  finalSession = false;
  compressButn = false;
  images: HTMLImageElement[] = []
  newImages: HTMLImageElement[] = []
  urlSizes: string[] = [];
  url: string;
  urlError: boolean;
  isFileListEmpty: boolean;
  constructor(private platformLocation: PlatformLocation, private router: Router,
    private location: Location) {
    this.id = uuid.v4();
  }

  ngOnInit() {
    this.isFileListEmpty = false;
    this.urlError = false;
    this.proceedFlag = false;
    var bodyRow = document.getElementById('body-row');
  }

  ngAfterViewInit(){
    this.platformLocation.onPopState(()=>{
      console.log('back');
      this.location.go('/image-compress');
    })
  }

  chooseFile() {
    $('#input').click();
  }
  firstTabBtn() {
    this.secondTabFlag = false;
    this.proceedFlag = false;
  }

  secondTabBtn() {
    this.secondTabFlag = true;
    this.proceedFlag = true;
  }

  checkSecondTab() {
    if (this.secondTabFlag == true) {
      return true;
    }
    else return false;
  }

  changeInput() {
    let that = this;
    this.isFileListEmpty = false;
    this.img = <HTMLImageElement>document.querySelector('img,#image');
    this.files = (<HTMLInputElement>document.querySelector('input[type=file],#input')).files
    this.inputFlag = true;
    this.compressButn = true;
    for (var i = 0; i < this.files.length; i++) {
      this.fileList.push(this.files[i])
    }
    this.fileList.forEach((file, index) => {
      var reader = new FileReader();
      var imageCompressor = new ImageCompressor();
      that.img = new Image();
      reader.onload = function () {
        that.img.src = reader.result
      }
      if (file) {
        reader.readAsDataURL(file);
      }
      new ImageCompressor(file, {
        quality: .6,
        success: function (result) {
          console.log(index)
          console.log(result);
          that.fileNames.push(file.name)
          that.fileSizes.push(file.size);
          that.resultSizes.push(result.size);
          var saved = Math.round(100 - result.size * 100 / file.size)
          that.saveList.push(saved);
          var url = window.URL.createObjectURL(result)
          that.downloadLinks.push(url)
        },
      })
    })
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

  downloadImages() {
    this.downloadLinks.forEach((downloadLink, index) => {
      console.log(downloadLink)
      var link = document.createElement('a');
      link.setAttribute('href', downloadLink);
      link.setAttribute('download', `image${index}.jpg`);
      link.click();
    })
  }
  compress() {
    this.finalSession = true;
    this.compressButn = false;
  }

  deleteRow(index) {
    this.fileNames.splice(index, 1)
    this.fileList.splice(index, 1)
    this.downloadLinks.splice(index, 1)
    if(this.fileList.length == 0){
      this.isFileListEmpty = true;
    }
    else if(this.fileList.length != 0){
      this.isFileListEmpty = false
    }
  }

  loadRemoteImage(url) {
    let that = this;
    // this.isUrl = true;
    return new Promise((resolve, reject) => {
      var image = new Image();
      image.onload = async function () {
        resolve(image)
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
      request.send();
      request.onerror = function (e) {
        console.log('err' + e)
        that.urlError = true;
      }
    })
  }

  async proceedUrl() {
    this.proceedFlag = true;
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    let that = this;
    this.inputFlag = true;
    this.compressButn = true;
    this.urls.push(this.url)
    for(var i = 0; i< this.urls.length;i++){
      if(!(this.urls[i].match(regex))){
        this.urlError = true;
      }
      var image = <HTMLImageElement> await this.loadRemoteImage(this.urls[i]);
      image.name = (this.urls[i].substr(this.urls[i].length - 20))
      var remote = require('remote-file-size');
      console.log(this.urls[i])
      remote(this.urls[i], function (err, o) {
        that.fileSizes.push(o)
        console.log(o);
        if(err != null){
          console.log('Unable to get file size')
          that.fileSizes.push(0);
        }
      })
      var imgBlob = this.b64toBlob(image.src);
      new ImageCompressor(imgBlob, {
        quality: .6,
        success: function (result) {
          that.fileNames.push(image.name)
          that.resultSizes.push(result.size);
          var url = window.URL.createObjectURL(result)
          that.downloadLinks.push(url)
        },
      })
    }
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

}