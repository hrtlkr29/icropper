import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ImageUploadModule } from "angular2-image-upload";
import { Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu-component/menu-component.component';
import { ImageCropService } from './services/image-service.service';
import { FormsModule } from '@angular/forms';
import { CropImageComponent } from './crop-image/crop-image.component';
import { CompressImageComponent } from './compress-image/compress-image.component';
import { BulkResizeComponent } from './bulk-resize/bulk-resize.component';
import { BulkResizeService } from './services/bulk-resize-service.service';



// const routes: Routes=[
//   {path: '',redirectTo: 'main',pathMatch:'full'},
//   {path:'main',component: MenuComponent,children:[
//     {path:'',redirectTo: 'image-crop-upload',pathMatch:'full'},
//     {path:'image-crop-upload',component:ImageCropUploadComponent}
//   ]}
// ]

const routes: Routes=[
  {path:'',redirectTo: '',pathMatch:'full'},
  {path:'',component:MenuComponent,children:[
    {path:'',redirectTo:'image-crop',pathMatch:'full'},
    {path:'image-crop',component:CropImageComponent},
    {path:'image-compress',component:CompressImageComponent},
    {path:'image-bulk',component:BulkResizeComponent}
  ]}
]



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CropImageComponent,
  CompressImageComponent,
  BulkResizeComponent
  ],
  imports: [
    ImageUploadModule.forRoot(),
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [ImageCropService,BulkResizeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
