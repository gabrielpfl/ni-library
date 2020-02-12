import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiDataTable } from './ni-data-table.component';
import { NiTopTabsModule } from '../ni-top-tabs/ni-top-tabs.module';
import { NiFiltersModule } from '../ni-filters/ni-filters.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NiTopTabsModule,
    NiFiltersModule
  ],
  declarations: [
    NiDataTable
  ],
  exports: [
    NiDataTable
  ],
  entryComponents: [
  ],
})
export class NiDataTableModule { }