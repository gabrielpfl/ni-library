import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subject, merge, of as observableOf } from 'rxjs'
import { catchError, map, startWith, switchMap, takeUntil, debounceTime } from 'rxjs/operators'
import { SelectionModel } from '@angular/cdk/collections'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { DomSanitizer } from '@angular/platform-browser'
import * as _moment from 'moment-timezone'
import { NiAlgoliaService } from 'ni-algolia-functions'

import { NiTopTabs } from '../ni-top-tabs/ni-top-tabs.component'

import { FormControl, FormGroup } from '@angular/forms'
import { MatMenuTrigger } from '@angular/material/menu';
import { NiRow } from '../../directives/ni-row/ni-row.directive';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
const moment = _moment;

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
	@Input() tabs: any[] = []
	@Input() tabsStyle: string // default | joined
	@Input() filters: any[] = []
	@Input() filterComparator: string = 'AND'
	@Input() hideSearchSection: boolean
	@Input() hidePaginator: boolean
	@Input() columns: any[] = []
	@Input() sortActive: string
	@Input() sortDirection: string
	@Input() tableActions: any[] = []
	@Input() rowActions: any[] = []
	@Input() height: string
	@Input() searchValue: string
	@Input() searchPlaceholder: string
	@Input() rowClass: any
	@Input() searchParams: any = {
		page: 0,
        hitsPerPage: 20
	}

	@Output() onSearch = new EventEmitter()
	@Output() onFilter = new EventEmitter()
	@Output() rowAction = new EventEmitter()
	@Output() tableAction = new EventEmitter()
	@Output() sortedColumns = new EventEmitter()

	search: FormControl = new FormControl()

	dataSource: any
	selection = new SelectionModel<Element>(true, []);
	total = 0;
  	isLoadingResults = true;
	isRateLimitReached = false;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(NiTopTabs, { static: true }) topTabs: NiTopTabs;
	@ViewChild('filterPanel', { static: false } ) filterMenu: MatMenuTrigger
	@ViewChildren(NiRow) niRows: QueryList<NiRow>

	filter = new BehaviorSubject<any>(null)

	previousPageIndex
	activeTab
	statusFiltered: boolean = false

	contextMenuPosition = { x: '0px', y: '0px' }
	currentFilter

	rowSelected: NiRow
	rowSelectedIndex = -1

	displayedColumns = []

	private unsubscribe = new Subject<void>()

	constructor(
		private algoliaService: NiAlgoliaService,
		public sanitizer: DomSanitizer
	) {
		this.dataSource = new MatTableDataSource()
	}

	ngOnInit() {
		this.search.setValue(this.searchValue, {emitEvent: false})

		this.setColumns()
		
		this.search.valueChanges.pipe(
			map((value) => {
				this.onSearch.emit(value)
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
		})

		merge(this.sort.sortChange, this.paginator.page, this.filter)
		.pipe(
			startWith({}),
			switchMap(() => {
				this.selection.clear()
				
				this.isLoadingResults = true
				this.isRateLimitReached = false
				
				const args = this.buildParams()

				return this.algoliaService.search(args)
			}),
			map((data: any) => {
				// Flip flag to show that loading has finished.
				this.isLoadingResults = false;
				this.isRateLimitReached = false;
				this.total = this.searchParams.hitsPerPage ? data.nbHits : 0
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
					if(filter.hasOwnProperty('canFilter')){
						if(!filter.canFilter) return;
					}
					if(filter.type === 'checkbox'){
						filter.choices.getRawValue().map(choice => {
							if(choice.selected){
								ORFilters = [...ORFilters, {
									key: filter.key,
									value: filter.operator === 'IN' ? [choice.value] : choice.value,
									operator: choice.operator ? choice.operator : filter.operator
								}]
							}
						})
						filter['filtered'] = filter.choices.getRawValue().some(choice => choice.selected)
					} else if(filter.type === 'daterange'){
						if(filter.from.value && filter.to.value){
							let from = moment(filter.from.value.format('YYYY-MM-DDTHH:mm:ss'))
							let to = moment(filter.to.value.format('YYYY-MM-DDTHH:mm:ss')).add(1, 'd')
							from = filter.hasOwnProperty('tz') && filter.tz ? from.tz(filter.tz).hour(0) : from
							to = filter.hasOwnProperty('tz') && filter.tz ? to.tz(filter.tz).hour(0) : to
							
							filters = [...filters, 
								[{
									key: filter.key,
									value: from.unix()*1000,
									operator: '>='
								}],
								[{
									key: filter.key,
									value: to.unix()*1000,
									operator: '<'
								}]
							]
						}
						filter['filtered'] = filter.from.value && filter.to.value ? true : false
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
		this.onFilter.emit()
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

	runRowAction(action, row: NiRow){
		action.action(row)
		this.rowAction.emit(row)
	}

	getRowActionPermissions({canActivate}, row: NiRow, i) {
		if(typeof canActivate === 'boolean'){
			return canActivate
		}
		return canActivate ? canActivate(row) : true
	}

	getTableActionPermissions({canActivate}) {
		if(typeof canActivate === 'boolean'){
			return canActivate
		}
		return canActivate(this.selection.selected)
	}

	runTableAction(action){
		if(!this.getTableActionPermissions(action)) return;
		const items = this.selection.selected.map(item => {
			const findRow = this.niRows.toArray().filter(r => r.data['objectID'] === item['objectID'])
			return findRow[0]
		})
		action.action(items)
		this.tableAction.emit(items)
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

	setColumns(){
		// const columns = this.columns.filter(column => column.display).map(column => column.key)
		const columns = this.columns.map(column => column.key)
		columns.unshift('select')
		this.displayedColumns = columns
	}

	filterFiltered(filter){
		return filter.hasOwnProperty('filtered') && filter.filtered
	}

	onRightClick(event, actionsPanel, rowData, index){
		event.preventDefault();
		
		if(!this.rowActions.length) return;

		this.rowSelected = this.niRows.toArray()[index]
		this.rowSelectedIndex = index
    	this.contextMenuPosition.x = event.clientX + 'px';
		this.contextMenuPosition.y = event.clientY + 'px';
		actionsPanel.openMenu()
	}

	actionsClosed(event){
		this.rowSelected = null
		this.rowSelectedIndex = -1
	}

	dropColumns(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
		this.columns = this.columns.sort((a, b) => {
			return this.displayedColumns.indexOf(a.key) - this.displayedColumns.indexOf(b.key)
		})
		this.setColumns()
		this.sortedColumns.emit(this.columns)
	}

	getFilteredChoices(searchValue, filter){
		if(searchValue){
			return filter.choices.controls.filter(c => c.value.label.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)
		}
		return filter.choices.controls
	}

	ngOnDestroy() {
		this.unsubscribe.next();
    	this.unsubscribe.complete();
	}

}
