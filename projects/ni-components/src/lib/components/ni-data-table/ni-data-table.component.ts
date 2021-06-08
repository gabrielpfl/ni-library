import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator';
import { Subject, merge, of as observableOf, BehaviorSubject } from 'rxjs'
import { catchError, debounceTime, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators'
import { SelectionModel } from '@angular/cdk/collections'
import { trigger, state, style, transition, animate } from '@angular/animations'
import {  orderBy } from 'lodash'
import { DomSanitizer } from '@angular/platform-browser'
import Fuse from 'fuse.js'
import { FormControl } from '@angular/forms';
import { NiRow } from '../../directives/ni-row/ni-row.directive';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ni-data-table',
  templateUrl: './ni-data-table.component.html',
  styleUrls: ['./ni-data-table.component.scss'],
  animations: [
    trigger('removingRow', [
		state('active', style({})),
      	state('removing', style({opacity: '1', background: '#fbe9e7', color: '#d50000',})),
      	/*transition('* => removing', animate(600, keyframes([
			style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
        	style({opacity: 1, transform: 'translateX(15px)', offset: 0.7}),
        	style({opacity: 0, transform: 'translateX(-100%)',  offset: 1.0})
		  ]))),*/
		transition('* => removing', animate('1000ms ease'))
      	//transition('unchecked => completed', animate('1250ms 1s ease-out'))
    ])
  ]
})
export class NiDataTable implements OnInit, OnDestroy, AfterViewInit {

	@Input() data = new BehaviorSubject<any[]>([])
	@Input() filtered: any[]
	@Input() hideSearchSection: boolean
	@Input() hidePaginator: boolean
	@Input() columns: any[]
	@Input() sortActive: string
	@Input() sortDirection: string
	@Input() tableActions: any[]
	@Input() rowActions: any[]
	@Input() height: string = '500px'
	@Input() searchValue: string
	@Input() searchPlaceholder: string

	@Output() onSearch = new EventEmitter()
	@Output() onFilter = new EventEmitter()
	@Output() rowAction = new EventEmitter()
	@Output() tableAction = new EventEmitter()
	@Output() sortedColumns = new EventEmitter()

	filter = new BehaviorSubject<any>(null)

	displayedColumns = ['select']

	dataSource: any
	selection = new SelectionModel<Element>(true, []);
	total = 0;
  	isLoadingResults = true;
	isRateLimitReached = false;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChildren(NiRow) niRows: QueryList<NiRow>

	previousPageIndex
	pageSize
	activeTab
	statusFiltered

	contextMenuPosition = { x: '0px', y: '0px' }

	rowSelected: NiRow
	rowSelectedIndex = -1

	search: FormControl = new FormControl()

	private unsubscribe = new Subject<void>()

	constructor(
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
		this.buildTable()
	}

	buildTable(){
		//Clear Selected rows
		this.selection.clear()

		this.paginator.pageIndex = 0

		// If the user changes the sort order or pageSize, reset back to the first page.
		this.filter.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.paginator.pageIndex = 0);
		this.sort.sortChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.paginator.pageIndex = 0);
		this.paginator.page.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			if(this.pageSize !== this.paginator.pageSize){
				this.paginator.pageIndex = 0
			}
		})

		merge(this.sort.sortChange, this.paginator.page, this.filter, this.data)
		.pipe(
			startWith({}),
			switchMap(() => this.data.pipe(take(1))),
			switchMap((data) => {
				this.selection.clear()
				
				this.isLoadingResults = true;
				this.isRateLimitReached = false;

				if(this.sort.sortChange || this.paginator.page){
					this.dataSource.data = []
				}

				return this.getData(data)
			}),
			map((res: any) => {
				// Flip flag to show that loading has finished.
				this.isLoadingResults = false
				this.isRateLimitReached = false
				this.total = res.total
				this.pageSize = this.paginator ? this.paginator.pageSize : 0

				return res.results;
			}),
			catchError(err => {
				this.isLoadingResults = false;
				// Catch if the API has reached its rate limit. Return empty data.
				this.isRateLimitReached = true;

				console.error(err)
				
				return observableOf([]);
			}),
			takeUntil(this.unsubscribe)
		).subscribe(res => {
			this.dataSource.data = res
		})
	}

	async getData(data: any[]){
		let results = data
		let total = data.length

		if(this.search.value){
			const options = {
				threshold: 0.3,
				location: 0,
				distance: 100,
				keys: this.columns.map(column => column.key)
			}
	
			const searcher = new Fuse(results, options)
			results = searcher.search(this.search.value).map(obj => obj.item)
		}

		if(this.sort){
			results = orderBy(results, row => row[this.sort.active], [this.sort.direction as any])
		}

		results = this.paginate(results, this.paginator.pageSize, this.paginator.pageIndex)

		return {total, results}
	}

	paginate(array, page_size, page_index) {
		// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
		return array.slice(page_index * page_size, (page_index+1) * page_size);
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
			const findRow = this.niRows.toArray().filter(r => r['id'] === item['id'])
			return findRow[0]
		})
		action.action(items)
		this.tableAction.emit(items)
	}

	clearInput(){
		this.search.setValue('')
	}

	setColumns(){
		// const columns = this.columns.filter(column => column.display).map(column => column.key)
		const columns = this.columns.map(column => column.key)
		columns.unshift('select')
		this.displayedColumns = columns
	}

	dropColumns(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
		this.columns = this.columns.sort((a, b) => {
			return this.displayedColumns.indexOf(a.key) - this.displayedColumns.indexOf(b.key)
		})
		this.setColumns()
		this.sortedColumns.emit(this.columns)
	}

	ngOnDestroy() {
		this.unsubscribe.next();
    	this.unsubscribe.complete();
	}

}