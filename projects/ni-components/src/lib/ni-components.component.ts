import { Component, OnInit } from '@angular/core';
import { NiComponentsService } from './ni-components.service';
import { take } from 'rxjs/operators';
import { async, TestBed } from '@angular/core/testing';
import { NiComponentsModule } from './ni-components.module';
import { NiFormModal } from './components/ni-form-modal/ni-form-modal.component';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { OVERLAY_PROVIDERS, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

export class MatDialogMock {
	// When the component calls this.dialog.open(...) we'll return an object
	// with an afterClosed method that allows to subscribe to the dialog result observable.
	open() {
	  return {
		afterClosed: () => of({action: true})
	  };
	}
  }

beforeEach(async(() => {
    let overlayContainerElement: HTMLElement;
    TestBed.configureTestingModule({
		declarations: [ NiComponentsComponent ],
		imports: [],
        providers: [
            NiComponentsService,
            NiFormModal, 
            {provide:MatDialog, useClass: MatDialogMock},
            OVERLAY_PROVIDERS,
            // MatDialogModule,
            // {provide:MAT_DIALOG_SCROLL_STRATEGY, useValue: null},

            MatSnackBar
        ]
	  })
  }));



  

@Component({
  selector: 'ni-components',
  template: `
    <button (click)="openDialog()">Click here</button>
  `,
  styles: []
})
export class NiComponentsComponent implements OnInit {

	constructor(private sharedComponets: NiComponentsService) { }

	ngOnInit() {
		//this.open()
	}

	openDialog(){
		const args = {
			title: 'Edit Role',
			cancelLabel: 'Cancel',
			okLabel: 'Update Role',
			fields: [
				{
					type: 'checkbox',
					multiple: true,
					name: 'caps',
					label: 'Capabilities',
					required: false,
					choices: this.getCaps(),
					value: [],
					onOpen: () => {},
				}
			]
		}
		this.sharedComponets.openFormModal(args).afterClosed().pipe(take(1)).subscribe((data) => {
			console.log(data)
		})
	}

	getCaps(){
		const choices = [
			{value: 'uno', label: 'Uno'},
			{value: 'dos', label: 'Dos'},
			{value: 'tres', label: 'Tres'},
			{value: 'cuatro', label: 'cuatro'},
		]

		return choices
	}

}
