import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiQuillEditor } from './ni-quill-editor.component';
import { NiUploaderModule } from '../ni-uploader/ni-uploader.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NiUploaderModule,
    QuillModule,
  ],
  declarations: [
    NiQuillEditor
  ],
  exports: [
    NiQuillEditor
  ],
  entryComponents: [
  ],
})
export class NiQuillEditorModule { }