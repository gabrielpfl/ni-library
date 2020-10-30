import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiColumnContentComponent } from './ni-column-content.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    
  ],
  declarations: [
    NiColumnContentComponent
  ],
  exports: [
    NiColumnContentComponent
  ],
  entryComponents: [
  ],
})
export class NiColumnContentModule { }