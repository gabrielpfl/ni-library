import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface LoaderData {
	title: string
	counter: number
	ended: boolean
}

@Component({
  selector: 'ni-global-loader-modal',
  templateUrl: './ni-global-loader-modal.component.html',
  styleUrls: ['./ni-global-loader-modal.component.css']
})
export class NiGlobalLoaderModal implements OnInit {

	title: string

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: LoaderData,
		public dialogRef: MatDialogRef<NiGlobalLoaderModal>,
	) { 
		this.title = data.title
	}

	ngOnInit() {
	}

	onNoClick(): void {
		this.dialogRef.close(false);
	}

	onClick(): void {
		this.dialogRef.close(true);
	}

}
