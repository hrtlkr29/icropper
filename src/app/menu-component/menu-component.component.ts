import { Component, OnInit, Input, Output } from '@angular/core';
import * as $ from 'jquery';
import { ImageCropService } from '../services/image-service.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from 'events';
import Cropper from 'cropperjs';
@Component({
  selector: 'app-menu-component',
  templateUrl: './menu-component.component.html',
  styleUrls: ['./menu-component.component.css']
})
export class MenuComponent implements OnInit {
  colorFirstTab: boolean;
  colorSecondTab: boolean;
  colorThirdTab: boolean;
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
  imgFinal: HTMLImageElement;
  flipFlag: boolean;
  rotateFlag: boolean;
  cropFlag: boolean;
  constructor(private imageService: ImageCropService) {
  }

  ngOnInit() {
    this.colorFirstTab = true;
    this.colorSecondTab = false;
    this.colorThirdTab = false;
  }

  firstTab(){
    this.colorFirstTab = true;
    this.colorSecondTab = false;
    this.colorThirdTab = false;
  }

  secondTab(){
    this.colorFirstTab = false;
    this.colorSecondTab = true;
    this.colorThirdTab = false;
  }

  thirdTab(){
    this.colorFirstTab = false;
    this.colorSecondTab = false;
    this.colorThirdTab = true;
  }
}