import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiDataTableAlgolia } from './ni-data-table-algolia.component';
import { NiClickModule } from '../../directives/ni-click/ni-click.module';
import { NiColumnContentModule } from '../ni-column-content/ni-column-content.module';
import { NiRowModule } from '../../directives/ni-row/ni-row.module';
import { NiCellModule } from '../../directives/ni-cell/ni-cell.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NiClickModule,
    NiColumnContentModule,
    NiRowModule,
    NiCellModule
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