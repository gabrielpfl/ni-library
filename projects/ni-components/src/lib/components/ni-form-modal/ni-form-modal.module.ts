import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiFormModal } from './ni-form-modal.component';
import { NiAlertModule } from '../ni-alert/ni-alert.module';
import { NiDatepickerModule } from '../ni-datepicker/ni-datepicker.module';
import { NiDaterangepickerModule } from '../ni-daterangepicker/daterangepicker.module';
import { NiSelectModule } from '../ni-select/ni-select.module';
import { NiChipsSelectModule } from '../ni-chips-select/ni-chips-select.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NiAlertModule,
    NiDatepickerModule,
    NiSelectModule,
    NiChipsSelectModule,
    NiDaterangepickerModule,
    QuillModule
  ],
  declarations: [
    NiFormModal
  ],
  exports: [
  ],
  entryComponents: [
    NiFormModal
  ],
})
export class NiFormModalModule { }