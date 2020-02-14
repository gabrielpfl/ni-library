import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiDataTableAlgolia } from './ni-data-table-algolia.component';
import { NiDaterangepickerModule } from '../ni-daterangepicker/daterangepicker.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NiDaterangepickerModule
  ],
  declarations: [
    NiDataTableAlgolia
  ],
  exports: [
    NiDataTableAlgolia
  ],
  entryComponents: [
  ],
})
export class NiDataTableAlgoliaModule { }