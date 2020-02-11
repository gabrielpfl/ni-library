import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable} from 'rxjs';

@Component({
  selector: 'ni-top-tabs',
  templateUrl: './ni-top-tabs.component.html',
  styleUrls: ['./ni-top-tabs.component.scss']
})
export class NiTopTabs implements OnInit {

	@Input() tabs: any[]
	@Input() selectedTab = 0

	@Output() selectedTabChange = new EventEmitter()

	active: BehaviorSubject<any|null>;

	constructor() {
		this.active = new BehaviorSubject<any>(null);
	}

	ngOnInit() {
	}

	changeTab(event) {
		this.tabs.map((tab, i) => {
			if(event.index == i){
				this.selectedTab = i
				this.active.next(i)
				this.selectedTabChange.emit(i)
				return
			}
		})
		return false;
	}

}
