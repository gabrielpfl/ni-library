import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ni-nav-menu',
  templateUrl: './ni-nav-menu.component.html',
  styleUrls: ['./ni-nav-menu.component.css']
})
export class NiNavMenuComponent implements OnInit {
	@Input() title
	@Input() menu = []

	constructor() { }

	ngOnInit() {
	}

}
