import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as randomString_ from 'random-string';
const randomString = randomString_;
import Quill from 'quill'
import { TableCell, TableRow, Table, Contain, TableModule } from 'quill-table-module';
import ImageResize from 'quill-image-resize-module'
import { NiDropzoneComponent } from '../ni-uploader/ni-dropzone/ni-dropzone.component';
Quill.register('modules/imageResize', ImageResize)
Quill.register(TableCell);
Quill.register(TableRow);
Quill.register(Table);
Quill.register(Contain);
Quill.register('modules/table', TableModule);

@Component({
  selector: 'ni-quill-editor',
  templateUrl: './ni-quill-editor.component.html',
	styleUrls: ['./ni-quill-editor.component.css'],
	providers: [
		{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => NiQuillEditor),
		multi: true
		},
	]
})
export class NiQuillEditor implements ControlValueAccessor, OnInit {

	@Input() _value // notice the '_'
	@Input() placeholder: string
	@Input() bounds: any
	@Input() format: string = 'html' // html | object | text | json
	@Input() activeOnFocus: boolean = false
	@Input() uploader: any
	@Input() modules: any
	@Input() hiddenUploader: boolean = true
	@Input() minHeight: string = '0px'
	@Output() onFocus = new EventEmitter()
	@Output() upload = new EventEmitter()
	@ViewChild('editor', { static: false }) editor: QuillEditorComponent
	@ViewChild(NiDropzoneComponent, { static: false }) dropzone: NiDropzoneComponent

	editorInstance
	range

	disable: boolean
	active: boolean = true
	tabIndex = randomString({length: 10})

	defaultModules = {
		imageResize: true,
		table: true,
		toolbar: {
			container: [
				['bold', 'italic', 'underline', 'strike'],        // toggled buttons
				['blockquote', 'code-block'],
			
				[{ 'header': 1 }, { 'header': 2 }],               // custom button values
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
				[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
				[{ 'direction': 'rtl' }],                         // text direction
			
				[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			
				[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
				[{ 'font': [] }],
				[{ 'align': [] }],
			
				['clean'],                                         // remove formatting button
			
				['link'],                         // link and image, video
				//['table'],
				//['customoption']
			],
			handlers: {
				'customoption': (ev) => {
					const value = 'test'
					const cursorPosition = this.editorInstance.getSelection().index;
                    this.editorInstance.insertText(cursorPosition, value);
                    this.editorInstance.setSelection(cursorPosition + value.length);
				}
			}
		}
	}

	constructor(public sanitizer: DomSanitizer) { }

	get value(): any {
		return this._value;
	}

	set value(val) {
		this._value = val ? val : '';
		this.propagateChange(this._value);
	}

	ngOnInit(){
		if(this.activeOnFocus){
			this.active = false
		}

		this.modules = {...this.defaultModules, ...this.modules}
	}

	created(event) {
		this.editorInstance = event
		this.editorInstance.root.setAttribute('spellcheck', false)
	}

	onFocusEvent(event){
		this.onFocus.emit(event)
	}

	onFocusable(){
		if(this.activeOnFocus){
			this.active = true
		}
	}

	onSelectionChanged(event){
		//event.editor.insertEmbed(10, 'image', 'https://lh3.googleusercontent.com/-y0k3mn4v5SA/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rcLYb3d2-d2smLz5PI1O4-PWHsnpg/mo/photo.jpg?sz=46');
		//event.editor.insertText(2, 'jejejeje', 'bold', true)
		/*if (event.range) {
			if (event.range.length == 0) {
			  console.log('User cursor is on', event.range.index);
			} else {
			  var text = event.quill.getText(event.range.index, event.range.length);
			  console.log('User has highlighted', text);
			}
		} else {
			//console.log('Cursor not in the editor');
			if(this.activeOnFocus){
				this.active = false
			}
		}*/
	}

	onContentChanged(event){
		this.editorInstance = event.editor
		this.range = this.editorInstance.getSelection()
		//this.value = this.editorInstance.container.getElementsByClassName("ql-editor")[0].innerHTML
		//console.log(this.editorInstance)
	}

	uploaded(file){
		const range = this.editorInstance.getSelection()
		const index = range ? range.index : this.editorInstance.getLength()
		if (file.path.endsWith('.png') || file.path.endsWith('.jpg') || file.path.endsWith('.jpeg')) {
			this.editorInstance.insertEmbed(index, 'image', file.downloadURL)
		}
		this.value = this.editorInstance.container.getElementsByClassName("ql-editor")[0].innerHTML
		this.upload.emit(file)
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
