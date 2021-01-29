import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NiCkeditor } from './ni-ckeditor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CKEditorModule
  ],
  declarations: [
    NiCkeditor
  ],
  exports: [
    NiCkeditor
  ],
  entryComponents: [
  ],
})
export class NiCkeditorModule { }