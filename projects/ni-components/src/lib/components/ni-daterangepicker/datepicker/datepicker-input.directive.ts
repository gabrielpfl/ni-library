/*
    RANGE: Most of the code is redundant and hera as inheritance boilerplate.
    The relevant code adds simple logic for a 2nd input, combined with minimal changes in the
    datepicker component, the work is done there so in native implementation this should have
    minimal changes, perhaps using dedicated input without min/max/filter etc... which are only
    set on the 1st input
*/

import { Directive, forwardRef, Optional, Input, Inject, ElementRef, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';

import { SgDatepickerComponent } from './datepicker.component';
import { Subscription } from 'rxjs';

export const SG_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SgDatepickerInputDirective),
  multi: true
};


export const SG_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SgDatepickerInputDirective),
  multi: true
};


@Directive({
  selector: '[sgDatepicker]',
  providers: [
    SG_DATEPICKER_VALUE_ACCESSOR,
    SG_DATEPICKER_VALIDATORS,
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: SgDatepickerInputDirective},
  ],
  host: {
    '[attr.aria-haspopup]': 'true',
    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
  },
  exportAs: 'sgDatepickerInput',
})
export class SgDatepickerInputDirective<D> extends MatDatepickerInput<D> implements OnDestroy {
  @Input()
  set sgDatepicker(value: SgDatepickerComponent<D>) {
    if (this._datepicker !== value) {
      this.unregister();
      this._datepicker = value;
      value._registerInputRangeEnd(this);
    }
  }

  private get _sgDatepicker() : SgDatepickerComponent<D> {
    return <any> this._datepicker;
  }

  private _sgDatepickerSubscription = Subscription.EMPTY;
  private _sgCvaOnChange: (value: any) => void = () => {};

  constructor(private _sgElementRef: ElementRef,
              @Optional() public _sgDateAdapter: DateAdapter<D>,
              @Optional() @Inject(MAT_DATE_FORMATS) private _sgDateFormats: MatDateFormats,
              @Optional() private _sgFormField: MatFormField) {
    super(_sgElementRef, _sgDateAdapter, _sgDateFormats, _sgFormField); 
  }

  ngAfterContentInit() {
    if (this._datepicker) {
      this._sgDatepickerSubscription = this._sgDatepicker._selectedChangedRangeEnd.subscribe((selected: D) => {
        this.value = selected;
        this._sgCvaOnChange(selected);
        this._onTouched();
        this.dateInput.emit(new MatDatepickerInputEvent(this, this._sgElementRef.nativeElement));
        this.dateChange.emit(new MatDatepickerInputEvent(this, this._sgElementRef.nativeElement));
      });
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unregister();
    this._sgDatepickerSubscription.unsubscribe();
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._sgCvaOnChange = fn;
    super.registerOnChange(fn);
  }

  private unregister(): void {
    if (this._sgDatepicker) {
      this._sgDatepicker._unregisterInputRangeEnd(this);
    }
  }
}
