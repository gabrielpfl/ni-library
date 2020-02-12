import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Observable} from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'ni-filters',
  templateUrl: './ni-filters.component.html',
  styleUrls: ['./ni-filters.component.scss']
})
export class NiFilters implements OnInit, OnDestroy {

	@Input() filters: Observable<any[]>
	@Output() filter = new EventEmitter()
	@Input() searchKey: string
	@Input() algoliaIndex: string
	@Input() searchLabel: string

	@ViewChild(MatMenuTrigger) dropdown: MatMenuTrigger;

	tableFilters: FormGroup

	applyFilters: BehaviorSubject<any|null>;

	filtered: boolean = false

	activeFilters: any[] = []

	private unsubscribe = new Subject<void>()

	constructor(
		private formBuilder: FormBuilder
	){
		this.applyFilters = new BehaviorSubject<any>(null)
		this.tableFilters = this.formBuilder.group({
			search: '',
			filtersSections: this.formBuilder.array([])
		})
	}

	ngOnInit() {
		this.loadFilters();

		this.tableFilters.get('search').valueChanges
		.pipe(debounceTime(500))
		.subscribe(value => {
			if(this.algoliaIndex){
				return this.runAlgoliaSearch()
			}
			return value ? this.runFilters() : this.clearFilters()
		})
	}

	loadFilters(){
		if(!this.filters) return;
		this.filters.pipe(takeUntil(this.unsubscribe)).subscribe(filters => {
			
			(<FormArray>this.tableFilters.get('filtersSections')).controls.splice(0);
			this.tableFilters.addControl('filtersSections', new FormArray([]))

			if(filters){
				filters.map((filter: any) => {
					let filterSection = new FormGroup({
						type: new FormControl(filter.type),
						key: new FormControl(filter.key),
						label: new FormControl(filter.label),
						open: new FormControl(filter.open ? filter.open : false),
						choices: new FormArray([]),
						value: new FormControl('')
					})
					if(filter.choices){
						filter.choices.map((choice: any) => {
							let choiceGroup = this.formBuilder.group(choice);
							(<FormArray>filterSection.get('choices')).push(choiceGroup)
						});
					}
					(<FormArray>this.tableFilters.get('filtersSections')).push(filterSection)
				})
			}
		})
	}

	showFilterSection(i){
		let groupSection = this.tableFilters.get('filtersSections')['controls'][i]
		if(groupSection.get('open').value == true){
			this.tableFilters.get('filtersSections')['controls'][i].get('open').setValue(false)
		}else{
			this.tableFilters.get('filtersSections')['controls'][i].get('open').setValue(true)
		}
	}

	runAlgoliaSearch(){
		this.filter.emit()

		this.activeFilters = []

		this.filtered = false

		this.applyFilters.next('filtered_algolia')
	}

	runFilters(){
		this.filter.emit()

		this.activeFilters = []

		if(this.tableFilters.get('search').value){
			let search = {
				key: this.searchKey ? this.searchKey : 'name',
				value: this.tableFilters.get('search').value,
				operator: '=='
			}
			this.activeFilters.push(search)
		}

		this.tableFilters.value.filtersSections.map(filterSection => {
			if(filterSection.value){
				let filter = {
					key: filterSection.key,
					value: filterSection.value,
					operator: '=='
				}
				this.activeFilters.push(filter)
			}
		})
		
		if(this.activeFilters && this.activeFilters.length > 0){
			this.filtered = true
			if(this.filters){
				this.dropdown.closeMenu()
			}
			this.applyFilters.next('filtered')
		}
	}

	clearFilters(){
		if(this.activeFilters && this.activeFilters.length > 0){
			this.filtered = false
			if(this.filters){
				this.dropdown.closeMenu()
			}
			this.tableFilters.get('search').setValue('')
			this.activeFilters = []
			this.tableFilters.get('filtersSections')['controls'].map(filterSection => {
				filterSection.get('value').setValue('')
			})
			this.applyFilters.next('cleared')
		}
	}

	clearInput(){
		this.tableFilters.get('search').setValue('')
	}

	cancelFilters(){
		this.dropdown.closeMenu()
	}

	ngOnDestroy() {
		this.unsubscribe.next();
    	this.unsubscribe.complete();
	}

}
