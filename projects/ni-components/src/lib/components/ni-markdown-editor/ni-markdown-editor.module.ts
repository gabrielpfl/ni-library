import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

import { MaterialModule } from '../../material.module';

import { NiMarkdownEditor } from './ni-markdown-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    MarkdownModule
  ],
  declarations: [
    NiMarkdownEditor
  ],
  exports: [
    NiMarkdownEditor
  ],
  entryComponents: [
  ],
})
export class NiMarkdownEditorModule { }