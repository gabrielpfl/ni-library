import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ni-dropzone',
  templateUrl: './ni-dropzone.component.html',
  styleUrls: ['./ni-dropzone.component.scss']
})
export class NiDropzoneComponent {

	@Input() collection: any
	@Input() fileObj: any
	@Input() path: string
	@Input() fileIndex: number = 0
	@Input() hiddenUploader: boolean = false
	@Input() disabled: boolean = false
	@Input() dropzone: boolean = true
	@Output() uploaded = new EventEmitter()

	isHovering: boolean;

	files: File[] = [];

	toggleHover(event: boolean) {
		if(this.disabled || !this.dropzone) return;
		this.isHovering = event;
	}

	onDrop(files: FileList) {
		if(this.disabled || !this.dropzone) return;
		for (let i = 0; i < files.length; i++) {
			this.files.push(files.item(i));
		}
	}

	getFileIndex(i){
		return this.fileIndex + i
	}

}
