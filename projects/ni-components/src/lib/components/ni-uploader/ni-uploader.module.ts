import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiUploadTaskComponent } from './ni-upload-task/ni-upload-task.component';
import { NiDropzoneComponent } from './ni-dropzone/ni-dropzone.component';
import { DropzoneDirective } from './dropzone.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  declarations: [
    NiUploadTaskComponent,
    NiDropzoneComponent,
    DropzoneDirective
  ],
  exports: [
    NiUploadTaskComponent,
    NiDropzoneComponent,
    DropzoneDirective
  ],
  entryComponents: [
  ],
})
export class NiUploaderModule { }