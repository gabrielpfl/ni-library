import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ni-alert',
  templateUrl: './ni-alert.component.html',
  styleUrls: ['./ni-alert.component.css']
})
export class NiAlert implements OnInit {

	@Input() type: string = 'info'

	constructor() { }

	ngOnInit() {
	}

}
