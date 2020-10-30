import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiDataTable } from './ni-data-table.component';
import { NiCellModule } from '../../directives/ni-cell/ni-cell.module';
import { NiRowModule } from '../../directives/ni-row/ni-row.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NiRowModule,
    NiCellModule
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