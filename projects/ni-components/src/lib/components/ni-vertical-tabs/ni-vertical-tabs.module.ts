import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { NiVerticalTabGroup } from './ni-vertical-tab-group/ni-vertical-tab-group.component';
import { NiVerticalTab } from './ni-vertical-tab/ni-vertical-tab.component';

import { NiVerticalTabLabelDirective } from './ni-vertical-tab-group/ni-vertical-tab-group.directive'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    NiVerticalTabGroup,
    NiVerticalTab,

    NiVerticalTabLabelDirective
  ],
  exports: [
    NiVerticalTabGroup,
    NiVerticalTab,

    NiVerticalTabLabelDirective
  ],
  entryComponents: [

  ],
})
export class NiVerticalTabsModule { }
