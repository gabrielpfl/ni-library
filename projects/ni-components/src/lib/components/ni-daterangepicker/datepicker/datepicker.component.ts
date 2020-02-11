/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The added/edited code adds logic for handling 1 or 2 inputs, i.e. range.
    When we have 2 inputs it's a range, otherwise its a single value date selection.
    The main logic is in `_select()` which handles range/non-range and inner range states. (this could
    probably be more orgenaized with proper states for clarity)

    Instead of "_userSelection" closing the popup/dialog from the calendar-content, the logic
    is moved here into _userSelection() which will close/keep based on range logic.
*/

import { Subject, Subscription } from 'rxjs';
import {
  Component, ChangeDetectionStrategy, Inject, Input, ViewEncapsulation, ViewContainerRef, Optional, NgZone,
  OnDestroy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Overlay } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker, MatDatepickerInput, MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';

import { SgDatepickerContentComponent } from '../datepicker-content/datepicker-content.component';

@Component({
  selector: 'sg-datepicker',
  template: '',
  exportAs: 'sgDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SgDatepickerComponent<D> extends MatDatepicker<D> implements OnDestroy {

  /** The currently selected date. */
  get _selectedRangeEnd(): D | null { return this._validSelectedRangeEnd; }
  set _selectedRangeEnd(value: D | null) { this._validSelectedRangeEnd = value; }
  private _validSelectedRangeEnd: D | null = null;

  /** Emits new selected date when selected date changes. */
  readonly _selectedChangedRangeEnd = new Subject<D>();
  _range: boolean = false;

  _datepickerInputRangeEnd: MatDatepickerInput<D>;
  private _inputRangeEndSubscription = Subscription.EMPTY;
  private _sgDialog: MatDialog;

  constructor(_sgDialog: MatDialog,
              private _sgOverlay: Overlay,
              private _sgNgZone: NgZone,
              private _sgViewContainerRef: ViewContainerRef,
              @Inject(MAT_DATEPICKER_SCROLL_STRATEGY) private _sgScrollStrategy,
              @Optional() private _sgDateAdapter: DateAdapter<D>,
              @Optional() private _sgDir: Directionality,
              @Optional() @Inject(DOCUMENT) private _sgDocument: any) {
    super(
      _sgDialog = Object.create(_sgDialog),
      _sgOverlay,
      _sgNgZone,
      _sgViewContainerRef,
      _sgScrollStrategy,
      _sgDateAdapter,
      _sgDir,
      _sgDocument
    );

    /*
          This is a monkey patch workaround to support a new component for dialog/popup.
          Because everything is freaking private in material, why would somone use protected anyway.
     */
    this._sgDialog = _sgDialog;
    this._sgDialog.open = <any> function (...args: any[]) {
      if (typeof args[0].createEmbeddedView !== 'function') {
        args[0] = SgDatepickerContentComponent;
      }
      return MatDialog.prototype.open.apply(_sgDialog, args);
    };

    Object.defineProperty(this, '_calendarPortal', {
      get: function () { return this.__calendarPortal; },
      set: function (value) {
        this.__calendarPortal = value;
        if (value) {
          value.component = SgDatepickerContentComponent;
        }
      }
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._inputRangeEndSubscription.unsubscribe();
  }

  _select(date: D): void {
    if (!this._range) {
      super.select(date);
    } else {
      if (!date) {
        if (this._selected && this._selectedRangeEnd) {
          super.select(null);
          this._selectRangeEnd(null);
        } else if (this._selected) {
          super.select(null);
        } else if (this._selectedRangeEnd) {
          this._selectRangeEnd(null);
        }
      } else if (!this._selected || this._selectedRangeEnd) {
        if (this._selectedRangeEnd) {
          this._selectRangeEnd(null);
        }
        super.select(date);
      } else {
        if (date < this._selected) {
          const swap = this._selected;
          super.select(date);
          this._selectRangeEnd(swap);
        } else if (date >= this._selected) { // notice date === this._selected is not skipped
          this._selectRangeEnd(date);
        }
      }
    }
  }

  _userSelection(): void {
    if ( !this._range || (this._selected && this._selectedRangeEnd) ) {
      this.close();
    }
  }

  _registerInputRangeEnd(input: MatDatepickerInput<D>): void {
    if (this._datepickerInputRangeEnd) {
      throw Error('A MatDatepicker can only be associated with a single range end input.');
    }
    this._datepickerInputRangeEnd = input;
    this._range = !!input;

    this._inputRangeEndSubscription.unsubscribe();
    if (this._range) {
      this._inputRangeEndSubscription =
        this._datepickerInputRangeEnd._valueChange.subscribe((value: D | null) => this._selectedRangeEnd = value);
    }
  }

  _unregisterInputRangeEnd(input?: MatDatepickerInput<D>): void {
    if (this._datepickerInputRangeEnd) {
      if (!input || input === this._datepickerInputRangeEnd) {
        this._datepickerInputRangeEnd = undefined;
        this._range = false;
        this._inputRangeEndSubscription.unsubscribe();
      }
    }
  }

  private _selectRangeEnd(date: D): void {
    const oldValue = this._selectedRangeEnd;
    this._selectedRangeEnd = date;
    if (!this._sgDateAdapter.sameDate(oldValue, this._selectedRangeEnd)) {
      this._selectedChangedRangeEnd.next(this._selectedRangeEnd);
    }
  }
}
