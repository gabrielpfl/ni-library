import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as randomString_ from 'random-string';
const randomString = randomString_;

@Component({
  selector: 'ni-markdown-editor',
  templateUrl: './ni-markdown-editor.component.html',
	styleUrls: ['./ni-markdown-editor.component.css'],
	providers: [
		{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => NiMarkdownEditor),
		multi: true
		},
	]
})
export class NiMarkdownEditor implements ControlValueAccessor, OnInit {

	@Input() _value // notice the '_'
	@Input() options: any = {  
		maxLines: Infinity,
		hScrollBarAlwaysVisible: false,
		autoScrollEditorIntoView: true
	}

	@Input() optionsFullScreen: any = {  
		hScrollBarAlwaysVisible: false,
		autoScrollEditorIntoView: true
	}
	
	disable: boolean
	active: boolean = true
	fullScreen: boolean = false
	preview: boolean = false

	@ViewChild('markDown', { static: true }) markDown;

	constructor() { }

	get value(): any {
		return this._value;
	}

	set value(val) {
		this._value = val;
		this.propagateChange(this._value);
	}

	ngOnInit(){
		
	}

	onChange(ev){

	}

	getText(){
		return this.markDown.element.nativeElement.innerText
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
