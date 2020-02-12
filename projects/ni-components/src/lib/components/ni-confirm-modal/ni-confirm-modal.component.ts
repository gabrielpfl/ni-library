import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ni-confirm-modal',
  templateUrl: './ni-confirm-modal.component.html',
  styleUrls: ['./ni-confirm-modal.component.css']
})
export class NiConfirmModal implements OnInit {

	text: string

	constructor(
		@Inject(MAT_DIALOG_DATA) private data,
		public dialogRef: MatDialogRef<NiConfirmModal>,
	) { 
		this.text = data.text
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
