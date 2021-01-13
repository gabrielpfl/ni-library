import { Component, OnInit, ViewChild, ElementRef, Input, forwardRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'ni-chips-select',
  templateUrl: './ni-chips-select.component.html',
  styleUrls: ['./ni-chips-select.component.css'],
  providers: [
	{
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => NiChipsSelectComponent),
	multi: true
	},
]
})
export class NiChipsSelectComponent implements OnInit {
	@Input() _value: string[] = []; // notice the '_'
	@Input() appearance = 'legacy'
	@Input() choices: string[] = [];
	@Input() label: string
	@Input() placeholder: string
	@Input() instructions: string
	@Input() addOnKeyEnter: boolean = false // when hints enter for non searcheables values

	//for chips field
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = false;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	chipCtrl = new FormControl();
	filteredChips: Observable<any[]>;

	@ViewChild('chipInput', { static: true }) chipInput: ElementRef<HTMLInputElement>;

	constructor() {
		this.chipsFilter()
	}

	ngOnInit() {
	}

	get value(): any {
		return this._value
	}

	set value(val) {
		this._value = val
		this.propagateChange(this._value);
	}

	chipsFilter(){
		this.filteredChips = this.chipCtrl.valueChanges.pipe(
			startWith(null),
			map((chip: string | null) => chip ? this._filter(chip) : this._filterSelected()));
	}

	add(event: MatChipInputEvent): void {
		if(!this.addOnKeyEnter) return;

		const input = event.input
		const value = event.value
		const _value = this.value
	
		// Add our chip
		if ((value || '').trim()) {
			_value.push(value.trim())
			this.value = _value
		}
	
		// Reset the input value
		if (input) {
		  	input.value = ''
		}
	
		this.chipCtrl.setValue(null)
	}
	
	remove(chip: string): void {
		const index = this._value.indexOf(chip)
		const value = this.value
	
		if (index >= 0) {
			value.splice(index, 1)
			this.value = value
		}
	}
	
	selected(event: MatAutocompleteSelectedEvent): void {
		const value = this.value
		value.push(event.option.viewValue);
		this.value = value
		this.chipInput.nativeElement.value = '';
		this.chipCtrl.setValue(null);
	}
	
	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
	
		return this.choices.filter(chip => {
			if(this.value.includes(chip)){
				return false;
			}
			return chip.toLowerCase().indexOf(filterValue) === 0
		});
	}

	private _filterSelected(): string[] {
		return this.choices.filter(chip => !this.value.includes(chip))
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

}
