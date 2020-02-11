import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { NiHelperSnippetsService } from 'ni-helper-snippets';
import { NiDatepicker } from '../ni-datepicker/ni-datepicker.component';

@Component({
  selector: 'ni-card-form',
  templateUrl: './ni-card-form.component.html',
  styleUrls: ['./ni-card-form.component.css']
})
export class NiCardFormComponent implements OnInit {

	@Input() type: string = 'bordered'
	@Input() form: FormGroup | FormArray
	@Input() fields: any[] = []
	@Input() title: string
	@Input() description: string
	@Input() listStyle: string

	contextMenuPosition = { x: '0px', y: '0px' }

	editFields = []

	dateFieldControl = new FormControl()
	@ViewChild('dateField', { static: false }) dateField

    constructor(
		public functions: NiHelperSnippetsService,
	) { }

    ngOnInit() {
	}

	onFieldClick(event, editFieldsPanel, field){
		event.preventDefault();

		if(!field.edit) return;

		let control = this.getFormControl(field.key)

		if(field.ownControl){
			control = new FormControl(control.value)
		}

		if(!control) return;

		field = {...field, control}
		
		this.editFields = [field]

		if(field.type === 'date'){
			this.dateFieldControl = control
			this.dateField.open()
			return;
		}

    	this.contextMenuPosition.x = event.clientX + 'px';
		this.contextMenuPosition.y = event.clientY + 'px';
		editFieldsPanel.openMenu()
		return false
	}
	
	getFormControl(key){
		if(!key) return false
		const keys = key.split('.')
		let formControl: any = this.form
		keys.map(k => {
			formControl = formControl.get(k)
		})
		return formControl
	}

	displayFieldValue(field){
		const control = this.getFormControl(field.key)
		if(field.displayValue){
			return field.displayValue(control ? control.value : false)
		}
		if(!control) return '';
		if(field.type !== 'date'){
			return control.value ? control.value : '-'
		}else if(field.type === 'date'){
			return control.value ? this.functions.dateFormat(control.value, 'MMM DD, YYYY', field.timeZone) : '-'
		}
	}

	openDp(field: NiDatepicker){
		field.open()
	}

}
