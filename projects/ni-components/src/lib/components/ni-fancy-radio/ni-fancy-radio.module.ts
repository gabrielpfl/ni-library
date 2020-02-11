import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { NiFancyRadioComponent } from './ni-fancy-radio.component';
import { FancyRadioChoiceDirective } from './ni-fancy-radio.directive';
import { NiFancyRadioChoiceComponent } from './ni-fancy-radio-choice/ni-fancy-radio-choice.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  declarations: [
    NiFancyRadioComponent,
    NiFancyRadioChoiceComponent,
    FancyRadioChoiceDirective
  ],
  exports: [
    NiFancyRadioComponent,
    NiFancyRadioChoiceComponent,
    FancyRadioChoiceDirective
  ],
  entryComponents: [
  ],
})
export class NiFancyRadioModule { }