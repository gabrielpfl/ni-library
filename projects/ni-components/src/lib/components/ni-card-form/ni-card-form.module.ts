import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiCardFormComponent } from './ni-card-form.component';
import { NiDatepickerModule } from '../ni-datepicker/ni-datepicker.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NiDatepickerModule
  ],
  declarations: [
    NiCardFormComponent
  ],
  exports: [
    NiCardFormComponent
  ],
  entryComponents: [
  ],
})
export class NiCardFormModule { }
