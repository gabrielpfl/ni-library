import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';
import { NiVerticalTabLabelDirective } from '../ni-vertical-tab-group/ni-vertical-tab-group.directive'

@Component({
  selector: 'ni-vertical-tab',
  templateUrl: './ni-vertical-tab.component.html',
  styleUrls: ['./ni-vertical-tab.component.scss']
})
export class NiVerticalTab implements OnInit {

	@Input() label: string
	@Input() scroll: boolean = false
	active: boolean = false

	@ContentChild(NiVerticalTabLabelDirective, { read: TemplateRef }) niTabLabelTemplate;

	constructor() { }

	ngOnInit() {
	}

}
