import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiGlobalLoaderModal } from './ni-global-loader-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  declarations: [
    NiGlobalLoaderModal
  ],
  exports: [
  ],
  entryComponents: [
    NiGlobalLoaderModal
  ],
})
export class NiGlobalLoaderModalModule { }