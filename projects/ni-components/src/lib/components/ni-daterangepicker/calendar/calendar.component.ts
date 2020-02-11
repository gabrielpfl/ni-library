/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The relevant code is marked with a comment.
*/

import { Component, Input, Inject, Injector, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output, Optional, ReflectiveInjector, ViewEncapsulation } from '@angular/core';

import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { ComponentPortal } from '@angular/cdk/portal';

import { MatDatepickerIntl, MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'sg-calendar',
  templateUrl: './calendar.component.html',
  host: {
    'class': 'mat-calendar',
  },
  exportAs: 'matCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgCalendarComponent<D> extends MatCalendar<D> {
  // THIS SECTION IS JUST TO PROVIDE MatCalendar as SgCalendar to MatCalendarHeader
  constructor(_intl: MatDatepickerIntl,
              @Optional() _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(MAT_DATE_FORMATS) _dateFormats: MatDateFormats,
              changeDetectorRef: ChangeDetectorRef,
              private _sgInjector: Injector) {
    super(_intl, _dateAdapter, _dateFormats, changeDetectorRef);
  }
  ngAfterContentInit(): void {
    super.ngAfterContentInit();    
    const injector = ReflectiveInjector.resolveAndCreate([
      { provide: MatCalendar, useValue: this }
    ], this._sgInjector);
    (<ComponentPortal<any>> this._calendarHeaderPortal).injector = injector;
  }

  /* RELEVANT CODE FOR NATIVE IMPLEMENTATION - ~ 10 LOC */

  @Input() range: boolean;

  @Input() get selectedRangeEnd(): D | null { return this._selectedRangeEnd; }
  set selectedRangeEnd(value: D | null) {
    this._selectedRangeEnd = (<any> this)._getValidDateOrNull( ( <any> this)._dateAdapter.deserialize(value));
  }

  @Output() readonly selectedRangeEndChange: EventEmitter<D> = new EventEmitter<D>();

  private _selectedRangeEnd: D | null;

  _dateSelectedRangeEnd(date: D): void {
    if (!(<any> this)._dateAdapter.sameDate(date, this.selectedRangeEnd)) {
      this.selectedRangeEndChange.emit(date);
    }
  }
}
