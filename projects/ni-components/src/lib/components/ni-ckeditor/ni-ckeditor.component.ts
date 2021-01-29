import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { CkEditorUploadAdapter } from "./ni-ckeditor.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import viewToPlainText from '@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext';
import { take, takeUntil } from "rxjs/operators";
import { difference } from 'lodash'
import { Subject } from "rxjs";

@Component({
	selector: 'ni-ckeditor',
	templateUrl: './ni-ckeditor.component.html',
    styleUrls: ['./ni-ckeditor.component.scss'],
	providers: [
		{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NiCkeditor),
            multi: true
		},
	]
})
export class NiCkeditor implements OnInit, OnDestroy {

    @Input() _value // notice the '_'
    @Input() config: any = {}
    @Input() storagePath: string
    @Output() image = new EventEmitter()
    @Output() onReady = new EventEmitter()
    @Output() onChange = new EventEmitter()
    @Output() deletedImages = new EventEmitter()
    
    disable: boolean = false

    public Editor = ClassicEditor
    editorInstance

    plainText: string

    images = []

    private unsubscribe = new Subject<void>()

	constructor(
        public sanitizer: DomSanitizer,
        public ckEditorUploadAdapter: CkEditorUploadAdapter
    ) { }

	get value(): any {
		return this._value;
	}

	set value(val) {
        this.ckEditorUploadAdapter.uploading.pipe(take(1)).subscribe(uplaoding => {
            if(uplaoding) return;
            this._value = val ? val : '';
            this.plainText = this.editorInstance? viewToPlainText(this.editorInstance.editing.view.document.getRoot()) : ''
            this.propagateChange(this._value);
            // this.verifyImagesURLs(val)
        })
	}

	ngOnInit(){
		this.ckEditorUploadAdapter.fileUploaded.pipe(takeUntil(this.unsubscribe)).subscribe(image => {
            if(image){
                this.image.emit(image)
            }
        })
	}

	_onReady(event) {
        this.editorInstance = event
        this.ckEditorUploadAdapter.setAdapter(this.editorInstance)
        this.ckEditorUploadAdapter.storagePath = this.storagePath
        this.onReady.emit(this.editorInstance)
    }
    
    _onChange( { editor }: ChangeEvent ) {
        const data = editor.getData()
        this.onChange.emit(data)
    }

    verifyImagesURLs(val){
        const images = Array.from( new DOMParser().parseFromString( val, 'text/html' )
            .querySelectorAll( 'img' ) )
            .map( img => img.getAttribute( 'src' ))
        
        const diff = difference(images, this.images)
        diff.length ? this.images = diff : ''
        const toDelete = difference(this.images, images)

        if(toDelete.length){
            this.deletedImages.emit(toDelete)
        }

        toDelete.map(img => {
            this.ckEditorUploadAdapter.deletedImage(img)
        })
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
    
    ngOnDestroy(){
        this.unsubscribe.next()
        this.unsubscribe.complete()
    }
}
