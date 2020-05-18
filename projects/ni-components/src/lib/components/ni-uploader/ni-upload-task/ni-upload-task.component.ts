import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'ni-upload-task',
  templateUrl: './ni-upload-task.component.html',
  styleUrls: ['./ni-upload-task.component.css']
})
export class NiUploadTaskComponent implements OnInit {

	@Input() file: File;
	@Input() mimeTypes = []
	@Input() fileObj: any
	@Input() path: string = '/'
	@Input() fileIndex: number = 0
	@Output() error = new EventEmitter()
	@Output() uploaded = new EventEmitter()

	task: AngularFireUploadTask;
  
	percentage: Observable<number>;
	snapshot: Observable<any>;
	downloadURL;
	noError: boolean = true
  
	constructor(private storage: AngularFireStorage) { }
  
	ngOnInit() {
	  	this.startUpload();
	}
  
	startUpload() {

		if(!this.path) return;

		if(this.mimeTypes.length && !this.mimeTypes.filter(type => -1 !== [this.file.type].indexOf(type)).length){
			this.noError = false
			this.error.emit({
				type: 'no-suppported-file',
				body: 'No supported file'
			})
			return;
		}
  
		// The storage path
		const path = `${this.path}${Date.now()}_${this.file.name}`;
	
		// Reference to storage bucket
		const ref = this.storage.ref(path);
	
		// The main task
		this.task = this.storage.upload(path, this.file);
	
		// Progress monitoring
		this.percentage = this.task.percentageChanges();
	
		this.snapshot   = this.task.snapshotChanges().pipe(
			tap(console.log),
			// The file's download URL
			finalize( async() =>  {
				this.downloadURL = await ref.getDownloadURL().toPromise();

				this.fileObj = {
					...this.fileObj, 
					downloadURL: this.downloadURL, 
					filename: this.file.name,
					path, 
					order: this.fileIndex
				}

				this.uploaded.emit(this.fileObj);
			}),
		);
	}
  
	isActive(snapshot) {
	  	return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
	}

}
