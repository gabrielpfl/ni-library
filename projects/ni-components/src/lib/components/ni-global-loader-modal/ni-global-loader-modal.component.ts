import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'ni-global-loader-modal',
  templateUrl: './ni-global-loader-modal.component.html',
  styleUrls: ['./ni-global-loader-modal.component.css']
})
export class NiGlobalLoaderModal implements OnInit {

	title: string
	value: number = 0
	load: boolean = false

	constructor(
		@Inject(MAT_DIALOG_DATA) public data,
		public dialogRef: MatDialogRef<NiGlobalLoaderModal>,
	) { 
		this.title = data.title
		this.value = data.value
	}

	ngOnInit() {
		setTimeout(() => {
			this.load = true
		}, 500)
	}

	onEnd() {
		if(this.data.value < 100) return;
		setTimeout(() => {
			this.dialogRef.close(true);
		}, 500)
	}

	onNoClick(): void {
		this.dialogRef.close(false);
	}

	onClick(): void {
		this.dialogRef.close(true);
	}

}
