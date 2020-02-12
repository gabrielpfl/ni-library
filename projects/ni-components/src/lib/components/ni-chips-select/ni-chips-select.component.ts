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
	@Input() _chips: string[] = []; // notice the '_'
	@Input() choices: string[] = [];
	@Input() placeholder: string
	@Input() instructions: string
	@Input() onEnter: boolean = false // when hints enter for non searcheables values

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

	get chips(): any {
		return this._chips
	}

	set chips(val) {
		this._chips = val
		this.propagateChange(this._chips);
	}

	chipsFilter(){
		this.filteredChips = this.chipCtrl.valueChanges.pipe(
			startWith(null),
			map((chip: string | null) => chip ? this._filter(chip) : this._filterSelected()));
	}

	add(event: MatChipInputEvent): void {
		if(!this.onEnter) return;

		const input = event.input;
		const value = event.value;
	
		// Add our chip
		if ((value || '').trim()) {
		  this.chips.push(value.trim());
		}
	
		// Reset the input value
		if (input) {
		  input.value = '';
		}
	
		this.chipCtrl.setValue(null);
	}
	
	remove(chip: string): void {
		const index = this.chips.indexOf(chip);
	
		if (index >= 0) {
		  this.chips.splice(index, 1);
		}
	}
	
	selected(event: MatAutocompleteSelectedEvent): void {
		this.chips.push(event.option.viewValue);
		this.chipInput.nativeElement.value = '';
		this.chipCtrl.setValue(null);
	}
	
	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
	
		return this.choices.filter(chip => {
			if(this.chips.includes(chip)){
				return false;
			}
			return chip.toLowerCase().indexOf(filterValue) === 0
		});
	}

	private _filterSelected(): string[] {
		return this.choices.filter(chip => !this.chips.includes(chip))
	}

	//For ControlValueAccessor
	writeValue(value: any) {
		if (value !== undefined) {
			this.chips = value;
		}
	}
	
	propagateChange = (_: any) => { };

	registerOnChange(fn) {
		this.propagateChange = fn;
	}

	registerOnTouched() { }

}
