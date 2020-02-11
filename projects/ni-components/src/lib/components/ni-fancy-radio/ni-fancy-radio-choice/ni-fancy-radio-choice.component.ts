import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ni-fancy-radio-choice',
  templateUrl: './ni-fancy-radio-choice.component.html',
	styleUrls: ['./ni-fancy-radio-choice.component.scss'],
	host: {'class': 'ni-fancy-radio-choice'}
})
export class NiFancyRadioChoiceComponent implements OnInit {

	@Input() value

	constructor() { }

	ngOnInit() {
	}

}
