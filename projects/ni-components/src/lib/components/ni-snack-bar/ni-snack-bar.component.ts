import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'ni-snack-bar',
  templateUrl: './ni-snack-bar.component.html',
  styleUrls: ['./ni-snack-bar.component.css']
})
export class NiSnackBar {

	type: string
	message: string

	constructor(
		@Inject(MAT_SNACK_BAR_DATA) private dataSnackbar,
		public snackbarRef: MatSnackBarRef<NiSnackBar>,
	) {
		this.message = this.dataSnackbar.message
		this.type = this.dataSnackbar.type
	}

}
