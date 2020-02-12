import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidationErrors } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NiHelperSnippetsService } from 'ni-helper-snippets'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import * as _moment from 'moment'
import { Subject, Observable } from 'rxjs';
import { takeUntil, take, switchAll, switchMap } from 'rxjs/operators';

const moment = _moment

export interface NiFormData {
	title?: string,
	cancelLabel?: string,
	okLabel?: string,
	fields?: NiFormField[]
	notes?: NiFormNote[]
	formClass?: string
}

export interface NiFormField {
	type: string
	name: string
	label: string
	required?: boolean
	instructions?: string
	choices?: NiFormFieldChoice[] | Promise<NiFormFieldChoice[]> | Observable<NiFormFieldChoice[]>
	value?: any
	minDate?: any
	startAt?: any
	permissions?: boolean
	fieldClass?: string
	multiple?: boolean
	onOpen?(): void
	onLoad?(value: any): void
	onChange?(value: any): void
}

export interface NiFormFieldChoice {
	label: string
	value: any
}

export interface NiFormNote {
	type: string
	content: string
}


@Component({
  selector: 'ni-form-modal',
  templateUrl: './ni-form-modal.component.html',
  styleUrls: ['./ni-form-modal.component.css'],
})
export class NiFormModal implements OnDestroy {

	title: string
	fields: NiFormField[] = []
	notes: NiFormNote[] = []
	cancelLabel: string
	okLabel: string
	formClass: string

	fieldsArray = new FormArray([])

	private unsubscribe = new Subject<void>()
  
	constructor(
		@Inject(MAT_DIALOG_DATA) private data: NiFormData,
		public dialogRef: MatDialogRef<NiFormModal>,
		private functions: NiHelperSnippetsService
	) {
		this.title = data.title
		this.notes = data.notes ? data.notes : []
		this.fields = data.fields
		this.cancelLabel = data.cancelLabel
		this.okLabel = data.okLabel
		this.formClass = data.formClass

		this.init(data)
	}

	async init(data){
		await this.buildForm()

		this.fieldsArray.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(fields => {
			data.fields = fields
			this.fields = data.fields
		})
	}

	buildForm(){
		this.fields.map(field => {
			let validators =  [field.required ? Validators.required : Validators.nullValidator]
			if(field.type === 'checkbox'){
				validators = [...validators, Validators.minLength(1)]
			}
			const group = new FormGroup({
				type: new FormControl(field.type),
				name: new FormControl(field.name),
				choices: new FormControl([]),
				value: new FormControl(field.value ? field.value : null, validators)
			})

			if(field.label){
				group.addControl('label', new FormControl(field.label))
			}

			if(field.instructions){
				group.addControl('instructions', new FormControl(field.instructions))
			}
			
			if(field.onOpen){
				group.addControl('onOpen', new FormControl(field.onOpen))
			}

			if(field.minDate){
				group.addControl('minDate', new FormControl(field.minDate))
			}

			if(field.startAt){
				group.addControl('startAt', new FormControl(field.startAt))
			}

			if(field.multiple){
				group.addControl('multiple', new FormControl(field.multiple))
			}

			if(field.fieldClass){
				group.addControl('fieldClass', new FormControl(field.fieldClass))
			}

			if(field.choices){
				if(Array.isArray(field.choices)){
					group.get('choices').setValue(field.choices, {emitEvent: false})
				}else if(field.choices instanceof Promise){
					field.choices.then(data => {
						group.get('choices').setValue(data, {emitEvent: false})
					})
				}else{
					field.choices.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
						group.get('choices').setValue(data, {emitEvent: false})
					})
				}
			}

			if(field.hasOwnProperty('permissions') && !field.permissions){
				group.get('value').disable({emitEvent: false})
			}

			(<FormArray>this.fieldsArray).push(group)

			//value changes for each field
			if(field.onChange){
				group.get('value').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(value => {
					field['onChange'](value)
				})
			}

			if(field.onLoad){
				field.onLoad(group.get('value').value)
			}
		})
	}
  
	onNoClick(): void {
	  	this.dialogRef.close(false);
	}

	onClick(): void {
		if(this.fieldsArray.valid){
			this.dialogRef.close(this.fieldsArray.getRawValue());
		}else{
			this.functions.validateForm(this.fieldsArray); 
		}
	}

	onSelectOpen(event, openParams, index){
		if(!openParams) return;
		let choicesSubscriber = openParams.data.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
			this.fieldsArray.controls[index]

            let choices = []
			res.data().map(obj => {
				let choice = {
					label: obj[openParams.key],
					value: openParams.value ? obj[openParams.value] : obj
				}
				choices.push(choice)
			})
			this.fieldsArray.controls[index].get('choices').setValue(choices)
		})
	}

	checkedChoice(field: FormGroup, index): boolean {
		let value = field.get('value').value

		if(value.includes(index)){
			return true
		}

		return false
	}

	changeCheckbox(field: FormGroup, index){
		let value = field.get('value').value

		if(value.includes(index)){
			value = this.functions.removeElement(value, index)
		}else{
			value.push(index)
		}

		field.get('value').setValue(value)
	}

	getMinDate(field: FormGroup){
		if(!field.value.hasOwnProperty('minDate')) return;

		if(field.value.minDate instanceof Date){
			return field.get('minDate').value
		}

		const findMinField = this.fieldsArray.value.filter(f => f.name === field.get('minDate').value)

		if(findMinField.length){
			return findMinField[0].value
		}
		
		return false
	}

	ngOnDestroy() {
		this.unsubscribe.next();
    	this.unsubscribe.complete();
	}

}