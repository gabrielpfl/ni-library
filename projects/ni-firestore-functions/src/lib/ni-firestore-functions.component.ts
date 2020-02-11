import { Component, OnInit } from '@angular/core';
import { NiFirestoreService } from './ni-firestore-functions.service';

@Component({
  selector: 'ni-firestore-functions',
  template: `
    <p>
      ni-firestore-functions works!
    </p>
  `,
  styles: []
})
export class NiFirestoreFunctionsComponent implements OnInit {

	constructor(private firestoreService: NiFirestoreService) {
	}

	ngOnInit() {
	}

}
