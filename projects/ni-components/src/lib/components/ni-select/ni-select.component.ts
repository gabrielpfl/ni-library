import { 
	Component,
	Input,
	Output,
	QueryList,
	ContentChildren,
	OnInit,
	AfterContentInit,
	EventEmitter,
	forwardRef,
	ViewChild
} from '@angular/core'

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NiHelperSnippetsService } from 'ni-helper-snippets'
import { FormControl } from '@angular/forms'

import {MatSelectChange, MatSelect} from '@angular/material/select';

@Component({
	selector: 'ni-option',
	template: `
	<ng-content></ng-content>
	`,
})
export class NiOption{
	@Input() value: any
	@Input() viewValue: string
}

@Component({
	selector: 'ni-optgroup',
	template: `
	<ng-content></ng-content>
	`,
})
export class NiOptGroup implements AfterContentInit{
	@Input() label: string
	@ContentChildren(NiOption) options: QueryList<NiOption>

	data: NiOption[] = []

	ngAfterContentInit() {
		this.options.forEach(optionInstance => {
			this.data.push(optionInstance)
		})
	}
}

@Component({
	selector: 'ni-select',
	templateUrl: './ni-select.component.html',
	styleUrls: ['./ni-select.component.scss'],
	host: {'class': 'ni-select'},
	providers: [
		{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => NiSelect),
		multi: true
		},
	]
})
export class NiSelect implements ControlValueAccessor, OnInit, AfterContentInit {

	@Input() _selectValue; // notice the '_'
	@Input() multiple: boolean = false
	@Input() onKeyUp: boolean = true //Search on input change
	@Input() value: any
	@Input() exclude = []
	@Input() placeholder: string
	@Input() inputPlaceholder: string
	@Input() instructions: string
	@Output() selectionChange = new EventEmitter()
	@Output() opened = new EventEmitter()
	@Output() afterInputEnter = new EventEmitter()
	@ViewChild(MatSelect, { static: true }) matSelect: MatSelect
	@ContentChildren(NiOption) options: QueryList<NiOption>
	@ContentChildren(NiOptGroup) optGroups: QueryList<NiOptGroup>
	
	searchCtrl: FormControl;
	showLoader: boolean = false

	filteredGroupData: NiOptGroup[] = []
	dataGroup: NiOptGroup[] = []

	filteredData: NiOption[] = []
	data: NiOption[] = []

	disableSelect: boolean

	constructor(private functions:NiHelperSnippetsService){
		this.searchCtrl = new FormControl();
	}

	get selectValue(): any {
		return this._selectValue;
	}

	set selectValue(val) {
		this._selectValue = val ? val : '';
		this.propagateChange(this._selectValue);
		//console.log(this._dateValue);
	}

	ngOnInit(){
		if(this.value){
			this.selectValue = this.value
		}
	}

	ngAfterContentInit() {

		this.runFilter()

		this.options.forEach(optionInstance => {
			this.filteredData.push(optionInstance)
			this.data.push(optionInstance)
		})

		this.optGroups.forEach(optionInstance => {
			this.filteredGroupData.push(optionInstance)
			this.dataGroup.push(optionInstance)
		})

		this.exludeChoices()

		//When children changes
		this.options.changes.subscribe(options => {
			this.filteredData = []
			this.data = []
			options.forEach(optionInstance => {
				this.filteredData.push(optionInstance)
				this.data.push(optionInstance)
			})
			this.runFilter()
			this.exludeChoices()
			this.showLoader = false
		});

		//When children changes
		this.optGroups.changes.subscribe(groups => {
			this.filteredGroupData = []
			this.dataGroup = []
			groups.forEach(optionInstance => {
				if(optionInstance.data.length > 0){
					this.filteredGroupData.push(optionInstance)
					this.dataGroup.push(optionInstance)
				}
			})
			this.runFilter()
			//this.exludeChoices()
			this.showLoader = false
		});

		/*this.Choices.changes.subscribe(Choices => {
			Choices.forEach(optionInstance => {
				console.log(optionInstance)
			})
		})*/
		//let florida = this.Choices.find(option => option.value === 'Florida'); 
		//console.log(florida)
	}

	runFilter(){
		if(this.onKeyUp !== false){
			this.searchCtrl.valueChanges
			.subscribe(value => {
				this.filteredGroupData = value ? this.filterChoicesGroup(value) : this.dataGroup.slice()
				this.filteredData = value ? this.filterChoices(value) : this.data.slice()
			});
		}
	}

	filterChoicesGroup(name: string){
		let groups = this.dataGroup.map(this.copy).filter((group: NiOptGroup) => {
			return group.data = group.data.map(this.copy).filter((option: NiOption) => {
				return option.viewValue.toLowerCase().indexOf(name.toLowerCase()) !== -1
			})
		})

		groups = groups.filter((group: NiOptGroup) => group.data.length > 0)

		return groups
	}

	filterChoices(name: string) {
		return this.data.filter((option: NiOption) =>
			option.viewValue.toLowerCase().indexOf(name.toLowerCase()) !== -1
		);
	}
	
	selectChoice(value){
		//this.dataChoiceselected.next(value)
		this.selectionChange.emit(value)
	}

	exludeChoices(){
		for (let value of this.exclude) {
			this.data = this.functions.removeObject(this.data, 'value', value)
			this.filteredData = this.functions.removeObject(this.filteredData, 'value', value)
		}
	}

	searchOnEnter(value){
		if(this.onKeyUp == false){
			this.afterInputEnter.emit(value)
			this.filteredData = []
		}
	}

	onChange($event: MatSelectChange){
		//Run when selection changes
		this.selectionChange.emit($event.value)

		//For control value accesor
		this.selectValue = $event.value;
	}

	openedChanges(){
		if(this.matSelect.panelOpen){
			this.opened.emit()
		}
	}

	//For ControlValueAccessor
	writeValue(value: any) {
		if (value !== undefined) {
			this.selectValue = value;
		}
	}
	
	propagateChange = (_: any) => { };

	registerOnChange(fn) {
		this.propagateChange = fn;
	}

	registerOnTouched() { }

	setDisabledState(isDisabled: boolean): void {
		if(isDisabled){
			this.disableSelect = true;
		}else{
			this.disableSelect = false;
		}
	}

	copy(o) {
		return Object.assign({}, o)
	}

}
