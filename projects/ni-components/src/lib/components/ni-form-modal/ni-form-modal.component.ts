import { Component, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, ValidationErrors } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NiHelperSnippetsService } from 'ni-helper-snippets'
import * as _moment from 'moment'
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DomSanitizer } from '@angular/platform-browser';

const moment = _moment

export interface NiFormData {
	title?: string,
	cancelLabel?: string,
	okLabel?: string,
	fields?: NiFormField[]
	notes?: NiFormNote[]
	formClass?: string | string[] | Set<string> | { [klass: string]: any; }
	onSubmit?(fields): Promise<any>
}

export interface NiFormField {
	type: string
	name: string
	disabled?: boolean
	appearance?: string
	placeholder?: string
	label?: string
	required?: boolean
	instructions?: string
	choices?: NiFormFieldChoice[] | string[] | Promise<NiFormFieldChoice[] | string[]> | Observable<NiFormFieldChoice[] | string[]>
	value?: any
	min?: number
	max?: number
	minLength?: number,
	maxLength?: number,
	minDate?: any
	maxDate?: any
	startAt?: any
	accept?: string
	permissions?: boolean
	fieldClass?: string | string[] | Set<string> | { [klass: string]: any; }
	multiple?: boolean
	dropzone?: boolean
	addOnKeyEnter?: boolean
	addOnBlur?: boolean
	onOpen?(): void
	onLoad?(value: any): void
	onChange?(fieldsArray: any): void
	onClick?(fieldsArray): void
}

export interface NiFormFieldChoice {
	label: string
	value: any
}

export interface NiFormNote {
	type: string
	content: string
}

function isDataURL(s) {
	return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;


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
	formClass: string | string[] | Set<string> | { [klass: string]: any; }

	fieldsArray = new FormArray([])

	editorModules = {
		toolbar: {
			container: [
				['bold', 'italic', 'underline', 'strike'], // toggled buttons
				[{ 'color': [] }], // dropdown with defaults from theme
				['clean'], // remove formatting button
				['link'], // link and image, video
			],
		}
	}

	loading = false

	private unsubscribe = new Subject<void>()
  
	constructor(
		@Inject(MAT_DIALOG_DATA) private data: NiFormData,
		public dialogRef: MatDialogRef<NiFormModal>,
		private functions: NiHelperSnippetsService,
		public sanitizer: DomSanitizer,
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
		this.buildForm()

		this.fieldsArray.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(fields => {
			data.fields = fields
			this.fields = data.fields
		})
	}

	buildForm(){
		this.fields.map(field => {
			this.addControl(field)
		})
	}

	addControl(field, position = -1){
		let validators =  [field.required ? Validators.required : Validators.nullValidator]

		if((field.type === 'checkbox' || field.type === 'file') && field.required){
			validators = [...validators, Validators.minLength(1)]
		}

		if(field.minLength){
			validators = [...validators, Validators.minLength(field.minLength)]
		}

		if(field.maxLength){
			validators = [...validators, Validators.min(field.maxLength)]
		}

		if(field.min){
			validators = [...validators, Validators.min(field.min)]
		}

		if(field.max){
			validators = [...validators, Validators.min(field.max)]
		}

		if(field.type === 'email'){
			validators = [...validators, Validators.email]
		}

		const value = field.value || field.value === false ? field.value : null

		const group = new FormGroup({
			type: new FormControl(field.type),
			name: new FormControl(field.name),
			appearance: new FormControl(field.appearance ? field.appearance : 'legacy'),
			choices: new FormControl([]),
			value: new FormControl({value, disabled: field.disabled}, validators)
		})

		if(field.hasOwnProperty('disabled') && field.disabled == true || field.disabled == false){
			group.addControl('disabled', new FormControl(field.disabled))
		}

		if(field.label){
			group.addControl('label', new FormControl(field.label))
		}

		if(field.placeholder){
			group.addControl('placeholder', new FormControl(field.placeholder))
		}

		if(field.instructions){
			group.addControl('instructions', new FormControl(field.instructions))
		}
		
		if(field.onOpen){
			group.addControl('onOpen', new FormControl(field.onOpen))
		}

		if(field.minLength){
			group.addControl('minLength', new FormControl(field.minLength))
		}

		if(field.maxLength){
			group.addControl('maxLength', new FormControl(field.maxLength))
		}

		if(field.minDate){
			group.addControl('minDate', new FormControl(field.minDate))
		}

		if(field.maxDate){
			group.addControl('maxDate', new FormControl(field.maxDate))
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

		if(field.accept){
			group.addControl('accept', new FormControl(field.accept))
		}

		if(field.dropzone){
			group.addControl('dropzone', new FormControl(field.dropzone))
		}

		if(field.addOnKeyEnter){
			group.addControl('addOnKeyEnter', new FormControl(field.addOnKeyEnter))
		}

		if(field.addOnBlur){
			group.addControl('addOnBlur', new FormControl(field.addOnBlur))
		}

		if(field.type === 'html'){
			group.addControl('satinizedValue', new FormControl(this.sanitizer.bypassSecurityTrustHtml(value)))
		}

		if(field.type === 'daterange'){
			group.addControl('range', new FormGroup({
				from: new FormControl(),
				to: new FormControl()
			}))
		}

		if(field.choices){
			if(Array.isArray(field.choices)){
				group.get('choices').setValue(field.choices, {emitEvent: false})
			}else if(field.choices instanceof Promise){
				field.choices.then(data => {
					group.get('choices').setValue(data, {emitEvent: false})
				})
			}else if(field.choices instanceof Observable){
				field.choices.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
					group.get('choices').setValue(data, {emitEvent: false})
				})
			}
		}

		if(field.hasOwnProperty('permissions') && !field.permissions){
			group.get('value').disable({emitEvent: false})
		}

		if(field.onClick){
			group.addControl('onClick', new FormControl(field.onClick))
		}

		if(position === -1){
			(<FormArray>this.fieldsArray).push(group)
		}else{
			(<FormArray>this.fieldsArray).insert(position, group)
		}

		//value changes for each field
		if(field.onChange){
			group.get('value').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(value => {
				field['onChange'](this)
			})
		}

		if(field.onLoad){
			field.onLoad(group.get('value').value)
		}
	}

	deleteControl(fieldName){
		const index = this.fieldsArray.getRawValue().findIndex(f => f.name === fieldName)
		this.fieldsArray.removeAt(index)
	}
  
	onNoClick(): void {
	  	this.dialogRef.close(false)
	}

	async onClick() {
		try{
			if(this.fieldsArray.valid){
				this.loading = true
				if(this.data.hasOwnProperty('onSubmit')){
					await this.data.onSubmit(this.fieldsArray.getRawValue())
				}
				this.dialogRef.close(this.fieldsArray.getRawValue())
				this.loading = false
			}else{
				this.functions.validateForm(this.fieldsArray)
			}
		}catch(e){
			console.error(e)
			this.loading = false
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

	checkedChoice(field: FormGroup, choice, index): boolean {
		const value = field.get('value').value
		const choiceValue = this.getChoiceValue(choice)
		return value.some(v => v == choiceValue)
	}

	changeCheckbox(event: MatCheckboxChange, field: FormGroup, choice, index){
		let value = field.get('value').value
		const choiceValue = this.getChoiceValue(choice)

		if(!event.checked){
			value = value.filter(v => v != choiceValue)
		}else{
			value.push(choiceValue)
		}

		field.get('value').setValue(value)
	}

	onRangeChange(field: FormGroup){
		const value = (<FormGroup>field.get('range')).getRawValue()
		field.get('value').setValue(value)
	}

	async selectFiles(field: FormGroup, files){
		const maxLength = this.isMaxLength(field)

		// stop if max files are selected
		if(maxLength) return;

		const _files: File[] = Array.from(files)

		if(!_files.length) return;

		const value = field.get('value').value

		_files.map(async file => {
			const fileEncoded = await this.getBase64(file)
			const fileName = file.name
			value.push({filename: fileName, downloadURL: fileEncoded})
		})

		field.get('value').patchValue(value)
	}

	isMaxLength(field: FormGroup): boolean {
		const value = field.get('value').value
		const maxLength = field.value.hasOwnProperty('maxLength') ? field.get('maxLength').value : null

		if(maxLength && value.length === maxLength){
			return true
		}
		return false
	}

	removeFile(field: FormGroup, index){
		let value = field.get('value').value
		value = value.filter((file, i) => i !== index)
		field.get('value').setValue(value)
	}

	isImage(dataURI) {
		if(isDataURL(dataURI)){
			const blob = this.b64toBlob(dataURI)
			return blob.type.search( /^image\//i ) === 0
		}
		return this.checkURL(dataURI)
	}

	b64toBlob(dataURI){
		const parts = dataURI.split(',')
		const byteString = atob(parts[1])
		const ab = new ArrayBuffer(byteString.length)
		const ia = new Uint8Array(ab)
	
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i)
		}
		return new Blob([ab], { type: parts[0].split(';')[0].split(':')[1] })
	}

	getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = error => reject(error)
		})
	}

	onDrop(field: FormGroup, event){
		event.preventDefault();
		this.selectFiles(field, event.dataTransfer.files)
	}

	onDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
	}

	checkURL(url) {
		return url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif')
	}

	getChoiceValue(choice){
		return choice && choice.hasOwnProperty('value') ? choice.value : choice
	}

	getChoiceLabel(choice){
		return choice && choice.hasOwnProperty('label') ? choice.label : choice
	}

	ngOnDestroy() {
		this.unsubscribe.next()
    	this.unsubscribe.complete()
	}

}
