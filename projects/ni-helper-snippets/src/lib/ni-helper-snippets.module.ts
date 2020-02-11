import { NgModule } from '@angular/core';
import { NiHelperSnippetsComponent } from './ni-helper-snippets.component';
import { NiClickOutsideDirective, NgInitDirective } from './ni-helper-snippets.directive';



@NgModule({
  declarations: [
    NiHelperSnippetsComponent,
    NgInitDirective,
    NiClickOutsideDirective
  ],
  imports: [
  ],
  exports: [
    NiHelperSnippetsComponent,
    NgInitDirective,
    NiClickOutsideDirective
  ]
})
export class NiHelperSnippetsModule { }
