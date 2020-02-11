/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The relevant code is marked with a comment.
*/

import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDatepickerContent, MatCalendar, matDatepickerAnimations } from '@angular/material/datepicker';

import { SgDatepickerComponent } from '../datepicker/datepicker.component';
import { SgCalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'sg-datepicker-content',
  templateUrl: './datepicker-content.component.html',
  host: {
    'class': 'mat-datepicker-content',
    '[@transformPanel]': '"enter"',
    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
    '[class.mat-datepicker-content-above]': '_isAbove',
    '[class.sg-datepicker-range]': 'datepicker._range'
  },
  animations: [
    matDatepickerAnimations.transformPanel,
    matDatepickerAnimations.fadeInCalendar,
  ],
  exportAs: 'matDatepickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['color']
})
export class SgDatepickerContentComponent<D> extends MatDatepickerContent<D> {
  @ViewChild(SgCalendarComponent, { static: true }) _calendar: MatCalendar<D>;
  get sgDatepicker() : SgDatepickerComponent<D> {
    return <any> this.datepicker;
  }

  // THIS IS THE ONLY ADDITION
  onUserSelection(): void {
    this.sgDatepicker._userSelection();
  }
}
