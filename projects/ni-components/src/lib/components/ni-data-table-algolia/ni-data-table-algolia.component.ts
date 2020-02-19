import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subject, merge, of as observableOf } from 'rxjs'
import { catchError, map, startWith, switchMap, takeUntil, debounceTime } from 'rxjs/operators'
import { SelectionModel } from '@angular/cdk/collections'
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

import { NiAlgoliaService } from 'ni-algolia-functions'

import { NiTopTabs } from '../ni-top-tabs/ni-top-tabs.component'

import { FormControl, FormGroup } from '@angular/forms'
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'ni-data-table-algolia',
  templateUrl: './ni-data-table-algolia.component.html',
  styleUrls: ['./ni-data-table-algolia.component.scss'],
  animations: [
    trigger('removingRow', [
		state('active', style({})),
      	state('removing', style({opacity: '1', background: '#fbe9e7', color: '#d50000',})),
      	/*transition('* => removing', animate(600, keyframes([
			style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
        	style({opacity: 1, transform: 'translateX(15px)', offset: 0.7}),
        	style({opacity: 0, transform: 'translateX(-100%)',  offset: 1.0})
		  ]))),*/
		transition('* => removing', animate('1000ms ease')),
		/*transition('removing => removed', animate(600, keyframes([
			style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
        	style({opacity: 1, transform: 'translateX(15px)', offset: 0.7}),
        	style({opacity: 0, transform: 'translateX(-100%)',  offset: 1.0})
		])))*/
		state('removed', style({display: 'none'})),
      	//transition('unchecked => completed', animate('1250ms 1s ease-out'))
    ])
  ]
})
export class NiDataTableAlgolia implements OnInit, OnDestroy, AfterViewInit {

	@Input() index: string
	@Input() firestorePath: any
	@Input() tabs: any[]
	@Input() tabsStyle: string // default | joined
	@Input() filters: any[] = []
	@Input() filterComparator: string = 'AND'
	@Input() hideSearchSection: boolean
	@Input() hidePaginator: boolean
	@Input() columns: any[]
	@Input() sortActive: string
	@Input() sortDirection: string
	@Input() tableActions: any[]
	@Input() rowActions: any[]
	@Input() height: string
	@Input() searchLabel: string
	@Input() rowClass: any
	@Input() searchParams: any = {
		page: 0,
        hitsPerPage: 20
	}
	
	@Input() beforeTable: any
	@Output() onSearch = new EventEmitter()
	@Output() rowAction = new EventEmitter()
	@Output() tableAction = new EventEmitter()

	search: FormControl = new FormControl()

	displayedColumns = ['select']

	dataSource: any
	selection = new SelectionModel<Element>(true, []);
	resultsLength = 0;
  	isLoadingResults = false;
	isRateLimitReached = false;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(NiTopTabs, { static: true }) topTabs: NiTopTabs;
	@ViewChild('filterPanel', { static: false } ) filterMenu: MatMenuTrigger

	filter = new BehaviorSubject<any>(null)

	previousPageIndex
	activeTab
	statusFiltered: boolean = false

	contextMenuPosition = { x: '0px', y: '0px' }
	currentFilter

	private unsubscribe = new Subject<void>()

	constructor(
		private algoliaService: NiAlgoliaService,
		public sanitizer: DomSanitizer
	) {
		this.dataSource = new MatTableDataSource()
	}

	ngOnInit() {
		this.isLoadingResults = true

		this.columns.map(column => {
			this.displayedColumns.push(column.key)
		})

		this.displayedColumns.push('row-actions')

		this.search.valueChanges.pipe(
			map(() => {
				this.onSearch.emit()
			}),
			debounceTime(500),
			takeUntil(this.unsubscribe)
		).subscribe(() => {
			this.runFilters()
		})
	}

	ngAfterViewInit(){
		this.getData()
	}

	getData(){
		//Clear Selected rows
		this.selection.clear()
		this.isLoadingResults = true

		this.paginator.pageIndex = this.searchParams.page

		// If the user changes the sort order, pageSize or filter, reset back to the first page.
		this.filter.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.paginator.pageIndex = 0);
		this.sort.sortChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.paginator.pageIndex = 0);
		this.paginator.page.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			if(this.searchParams.hitsPerPage !== this.paginator.pageSize){
				this.paginator.pageIndex = 0
			}
		});

		merge(this.sort.sortChange, this.paginator.page, this.filter)
		.pipe(
			startWith({}),
			/*switchMap(() => {
				this.isLoadingResults = true;
				this.isRateLimitReached = false;

				if(this.firestorePath){
					return this.firestoreService.getCollection(this.firestorePath)
				}

				return []
			}),*/
			debounceTime(100),
			switchMap(async () => {
				if(this.beforeTable){
					await this.beforeTable()
				}
				return Promise.resolve()
			}),
			switchMap(() => {
				this.isLoadingResults = true
				this.isRateLimitReached = false
				
				const args = this.buildParams()

				return this.algoliaService.search(args)
			}),
			map((data: any) => {
				// Flip flag to show that loading has finished.
				this.isLoadingResults = false;
				this.isRateLimitReached = false;
				this.resultsLength = this.searchParams.hitsPerPage ? data.nbHits : 0
				this.searchParams.hitsPerPage = data.hitsPerPage
				this.searchParams.page = this.paginator.pageIndex

				return data.hits;
			}),
			catchError(err => {
				this.isLoadingResults = false;
				// Catch if the API has reached its rate limit. Return empty data.
				this.isRateLimitReached = true;

				console.error(err)
				
				return observableOf([]);
			}),
			takeUntil(this.unsubscribe)
		).subscribe(data => {
			this.dataSource.data = data
			return;
		})
	}

	buildParams(){
		let args = {
			index: this.index,
			search: {
				page: this.paginator.pageIndex,
				hitsPerPage: this.searchParams.hitsPerPage ? this.paginator.pageSize : 0,
			}
		}

		if(this.search.value){
			args.search['query'] = this.search.value
		}

		args['orderBy'] = this.sort ? this.sort.active : null
		args['order'] = this.sort ? this.sort.direction : null

		//Start the filters set up
		let filters = [...this.filters]

		//the filters in the columns
		this.columns.map(column => {
			if(column.filters && column.filters.length){
				column.filters.map(filter => {
					let ORFilters = []
					if(filter.type === 'checkbox'){
						filter.choices.getRawValue().map(choice => {
							if(choice.selected){
								ORFilters = [...ORFilters, {
									key: filter.key,
									value: choice.value,
									operator: filter.operator
								}]
							}
						})
						filter['filtered'] = filter.choices.getRawValue().some(choice => choice.selected)
					} else if(filter.type === 'daterange'){
						if(filter.from.value && filter.to.value){
							filters = [...filters, 
								[{
									key: filter.key,
									value: filter.from.value.unix()*1000,
									operator: '>='
								}],
								[{
									key: filter.key,
									value: filter.to.value.add(1, 'd').unix()*1000,
									operator: '<='
								}]
							]
						}
						filter['filtered'] = filter.from.value && filter.to.value
					}

					if(ORFilters.length){
						filters = [...filters, ORFilters]
					}
				})
			}
		})
		
		//the predefined filters
		if(filters && filters.length){
			args.search['filters'] = filters
			args.search['filterComparator'] = this.filterComparator
		}

		return args
	}

	openFilter(event, filter, filterPanel){
		event.preventDefault();
		this.currentFilter = filter
    	this.contextMenuPosition.x = event.clientX + 'px';
    	this.contextMenuPosition.y = event.clientY + 'px';
		filterPanel.openMenu()
		return false
	}

	filterClosed(event){
		this.currentFilter = null
	}

	runFilters(){
		this.filter.next('filter')
	}

	//Whether the number of selected elements matches the total number of rows.
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	//Selects all rows if they are not all selected; otherwise clear selection.
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => {
				this.selection.select(row)
			});
	}

	runRowAction(action, doc, i){
		const dataRow = {
			index: i,
			row: this.dataSource.data[i],
		}
		action.action(dataRow)
		this.rowAction.emit(dataRow)
	}

	getRowActionPermissions({canActivate}, row, i) {
		const dataRow = {
			index: i,
			row,
		}
		if(typeof canActivate === 'boolean'){
			return canActivate
		}
		return canActivate(dataRow)
	}

	getTableActionPermissions({canActivate}) {
		if(typeof canActivate === 'boolean'){
			return canActivate
		}
		return canActivate(this.selection.selected)
	}

	runTableAction(action){
		action.action(this.selection.selected)
		this.tableAction.emit(this.selection.selected)
	}

	clearInput(){
		this.search.setValue('')
	}

	clearFiltersCol(filter){
		if(filter.type === 'checkbox'){
			filter.choices.controls.map((choiceForm: FormGroup, i) => {
				if(!choiceForm.get('selected').disabled){
					choiceForm.get('selected').setValue(false)
				}
				
				if(i === (filter.choices.controls.length - 1)){
					this.filter.next('filter')
				}
			})
		}else if(filter.type === 'daterange'){
			filter.from.setValue(null)
			filter.to.setValue(null)
			this.filter.next('filter')
		}
	}

	ngOnDestroy() {
		this.unsubscribe.next();
    	this.unsubscribe.complete();
	}

}
