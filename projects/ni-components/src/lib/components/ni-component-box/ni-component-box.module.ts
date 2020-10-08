import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';
import { NiComponentBoxComponent } from './ni-component-box.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    NiComponentBoxComponent
  ],
  exports: [
    NiComponentBoxComponent
  ],
  entryComponents: [
  ],
  providers: []
})
export class NiComponentBoxModule { }