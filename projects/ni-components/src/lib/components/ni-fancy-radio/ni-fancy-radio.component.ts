import { 
	Component,
	NgModule,
	Input,
	Output,
	QueryList,
	ContentChildren,
	OnInit,
	AfterContentInit,
	EventEmitter,
	forwardRef,
	ElementRef
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NiFancyRadioChoiceComponent } from './ni-fancy-radio-choice/ni-fancy-radio-choice.component';

@Component({
  selector: 'ni-fancy-radio',
  templateUrl: './ni-fancy-radio.component.html',
  styleUrls: ['./ni-fancy-radio.component.scss'],
  providers: [
		{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => NiFancyRadioComponent),
		multi: true
		},
	]
})
export class NiFancyRadioComponent implements ControlValueAccessor, OnInit, AfterContentInit {
	@Input() selected;
	@Output() select = new EventEmitter();
	@ContentChildren(NiFancyRadioChoiceComponent, {descendants: true, read: ElementRef}) choices: QueryList<ElementRef>

	constructor() { }

	ngOnInit() {
	}

  	ngAfterContentInit() {
	}

	get value(): any {
		return this.selected;
	}

	set value(val) {
		this.selected = val;
		this.propagateChange(this.selected);
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

	selectChoice(value){
		this.value = value
		this.select.emit(value)
		this.choices.map((choiceInstance: ElementRef) => {
			choiceInstance.nativeElement.classList.remove("active");
		})
	}

}
