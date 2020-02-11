import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _moment from 'moment-timezone';
const moment = _moment;

@Component({
  selector: 'ni-datepicker',
  templateUrl: './ni-datepicker.component.html',
	styleUrls: ['./ni-datepicker.component.css'],
	providers: [
		{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => NiDatepicker),
		multi: true
		},
	]
})
export class NiDatepicker implements ControlValueAccessor, OnInit {

	@Input() _value // notice the '_'
	@Input() placeholder: string = ''
	@Input() dateformat: string = 'MMM DD, YYYY'
	@Input() materialInput: boolean
	@Input() inputStyle: any
	@Input() position: string
	@Input() touchUi: boolean = false

	@ViewChild('picker', { static: false }) picker: any

	disable: boolean

	constructor(public sanitizer: DomSanitizer) { }

	get value(): any {
		return this._value;
	}

	set value(val) {
		//this._value = val ? moment(val).format('YYYY-MM-DD') : '';
		this._value = val ? val : '';
		this.propagateChange(this._value);
	}

	ngOnInit(){
	}

	displayDate(value){
		return value ? moment(value).tz('UTC').format(this.dateformat) : null
	}

	open(){
		this.picker.open()
	}

	//For ControlValueAccessor
	writeValue(value: any) {
		if (value !== undefined) {
			this.value = value;
		}
	}
	
	propagateChange = (_: any) => { };

	registerOnChange(fn) {
		this.propagateChange = fn;
	}

	registerOnTouched() { }

	setDisabledState(isDisabled: boolean): void {
		if(isDisabled){
			this.disable = true;
		}else{
			this.disable = false;
		}
	}

	copy(o) {
		return Object.assign({}, o)
	}

}
