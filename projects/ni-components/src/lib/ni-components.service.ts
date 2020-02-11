import { Injectable } from '@angular/core'
import { MatDialog, MatSnackBar, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { NiSnackBar } from './components/ni-snack-bar/ni-snack-bar.component';
import { Observable } from 'rxjs';
import { NiConfirmModal } from './components/ni-confirm-modal/ni-confirm-modal.component';
import { NiFormModal, NiFormData } from './components/ni-form-modal/ni-form-modal.component';
import { NiGlobalLoaderModal } from './components/ni-global-loader-modal/ni-global-loader-modal.component';

@Injectable({
  providedIn: 'root'
})
export class NiComponentsService {

	constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
    ){
    }

     /**
     * Method to open an snackbar when a new provider is created or failed
	 * @param {string} message the message for the snack bar
	 * @param {string} type the type for the snack bar
     * @param {string} duration duration in miliseconds
     */
	openSnackBar(message, type, duration = 3000): MatSnackBarRef<NiSnackBar> {
		return this.snackBar.openFromComponent(NiSnackBar, {
			duration: duration,
			data: {
				message: message,
				type: type
			}
		})
    }

    /**
     * Method to open a confirm dialog
	 * @param {string} message the message for the confirmation dialog
	 * @param {string} width width px string if the dialog
     */
    openConfirmDialog(message: string, width: string = '550px'): MatDialogRef<NiConfirmModal> {
        return this.dialog.open(NiConfirmModal, {
            width: width,
            data: {
                text: message,
            }
        })
    }

    /**
     * Method to open an snackbar when a new provider is created or failed
	 * @param {NiFormData} data the data to open a form modal
	 * @param {string} width width px string if the dialog
     */
    openFormModal(data: NiFormData, width: string = '600px'): MatDialogRef<NiFormModal> {
        return this.dialog.open(NiFormModal, {
            width: width,
            data: data
        })
    }

    openGlobalLoaderModal(data: any, width: string = '600px'): MatDialogRef<NiGlobalLoaderModal> {
        return this.dialog.open(NiGlobalLoaderModal, {
            width: width,
            disableClose: true,
            data: data
        })
    }
}
