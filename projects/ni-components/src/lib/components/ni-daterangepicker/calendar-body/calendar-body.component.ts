/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The relevant code is marked with a comment.
*/

import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatCalendarBody } from '@angular/material/datepicker';

@Component({
  selector: '[sg-calendar-body]',
  templateUrl: './calendar-body.component.html',
  host: {
    'class': 'mat-calendar-body',
    '[class.sg-calendar-body-range]': 'range', // RELEVANT CODE FOR NATIVE IMPLEMENTATION
    'role': 'grid',
    'attr.aria-readonly': 'true'
  },
  exportAs: 'matCalendarBody',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgCalendarBodyComponent extends MatCalendarBody {

  /* RELEVANT CODE FOR NATIVE IMPLEMENTATION - ~ 13 LOC */
  @Input() range: boolean;
  @Input() allInRange: boolean;
  @Input() selectedRangeEndValue: number;

  _inRange(date: number): boolean {
    if (this.range) {
      if (this.allInRange) {
        return true;
      }

      if (this.selectedValue && !this.selectedRangeEndValue) {
        return date >= this.selectedValue;
      }
      if (this.selectedRangeEndValue && !this.selectedValue) {
        return date <= this.selectedRangeEndValue;
      }
      return date >= this.selectedValue && date <= this.selectedRangeEndValue;
    }
  }
}
