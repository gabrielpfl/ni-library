import { Component, OnInit, ContentChildren, AfterContentInit, QueryList, ElementRef, Input, OnDestroy } from '@angular/core';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NiVerticalTab } from '../ni-vertical-tab/ni-vertical-tab.component'


@Component({
  selector: 'ni-vertical-tab-group',
  templateUrl: './ni-vertical-tab-group.component.html',
  styleUrls: ['./ni-vertical-tab-group.component.scss']
})
export class NiVerticalTabGroup implements OnInit, AfterContentInit, OnDestroy {

	@Input() parent: boolean = false

	@ContentChildren(NiVerticalTab, {descendants: false}) subTabs: QueryList<NiVerticalTab>;
	@ContentChildren(NiVerticalTab, {descendants: false, read: ElementRef}) subTabsRef: QueryList<ElementRef>;

	tabs: any[] = []

	private unsubscribe = new Subject<void>()

	constructor() { }

	ngOnInit() {
	}

	ngAfterContentInit(){
		//populates tabs array
		this.subTabs.forEach((tabInstance: NiVerticalTab, i) => {
			this.tabs.push(tabInstance)
		})

		//Default fisrt tab activated
		this.subTabsRef['_results'][0].nativeElement.classList.add("active");
		this.tabs[0].active = true
		
		//When children changes
		this.subTabs.changes.pipe(takeUntil(this.unsubscribe)).subscribe(tabs => {
			this.tabs = []
			tabs.forEach((tabInstance: NiVerticalTab, i) => {
				this.tabs.push(tabInstance)
			})
		});

		this.subTabsRef.changes.pipe(takeUntil(this.unsubscribe)).subscribe(tabs => {
		})
	}

	ngOnDestroy() {
		this.unsubscribe.next();
    	this.unsubscribe.complete();
	}

	activateTab(i){
		//Tabs
		this.tabs.map((tab: NiVerticalTab) => {
			tab.active = false
		})
		this.tabs[i].active = true

		//Content Tabs
		this.subTabsRef.map((tabInstance: ElementRef) => {
			tabInstance.nativeElement.classList.remove("active");
		})
		this.subTabsRef['_results'][i].nativeElement.classList.add("active");
	}

	getTabClasses(tab: NiVerticalTab) {
		return {
			'active': tab.active,
		};
	}

}
