import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { SelectDirective, SelectInputDirective, SelectOptionDirective } from './ni-select.directive'
import { NiSelect, NiOption, NiOptGroup } from './ni-select.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    NiSelect,
    NiOptGroup,
    NiOption,
    SelectDirective,
    SelectInputDirective,
    SelectOptionDirective
  ],
  exports: [
    NiSelect,
    NiOptGroup,
    NiOption,
    SelectDirective,
    SelectInputDirective,
    SelectOptionDirective
  ]
})
export class NiSelectModule { }
