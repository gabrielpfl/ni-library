import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';
import { NiImageBoxComponent } from './ni-image-box.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    NiImageBoxComponent
  ],
  exports: [
    NiImageBoxComponent
  ],
  entryComponents: [
  ],
  providers: []
})
export class NiImageBoxModule { }