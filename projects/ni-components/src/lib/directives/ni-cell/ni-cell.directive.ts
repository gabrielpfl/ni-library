import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { NiRow } from '../ni-row/ni-row.directive';

@Directive({
    selector: '[ni-cell]',
    host: {
        '[innerHTML]': 'safeHtml',
        '(click)': 'onClick($event)',
    },
})
export class NiCell implements AfterViewInit, OnDestroy {

    @Input() column
    @Input() rows: QueryList<NiRow>
    @Input() index

    row: NiRow

    private _safeHtml: SafeHtml = ''
    
    set safeHtml(value: SafeHtml) {
       this._safeHtml = value;
    }
    
    get safeHtml(): SafeHtml {
        return this._safeHtml;
    }

    private unsubscribe = new Subject<void>()

    constructor(
        private elementRef: ElementRef,
        public sanitizer: DomSanitizer
    ){}

    ngAfterViewInit(){
        // Window[`NiColumnContentComponent${this.index}`] = this;
        // this.elementRef.nativeElement.innerHTML = safeHtml['changingThisBreaksApplicationSecurity']

        this.rows.changes.pipe(
            switchMap(() => {
                const rows = this.rows.toArray()
                this.row = rows[this.index]
                return this.row.updateRowData
            }),
            takeUntil(this.unsubscribe)
        ).subscribe(() => {
            this.loadHTML()
        })
    }

    private loadHTML(){
        this.safeHtml = this.getHTML()
    }

    getHTML(){
        // const html: any = this.column?.content ? `<span class="col-content" onclick="Window.NiColumnContentComponent${this.index}.onClick(event)">${this.column.content(this.row)}</span>` : ''
        const html: any = this.column?.content && this.row ? this.column.content(this.row.data) : ''
        return this.sanitizer.bypassSecurityTrustHtml(html)
    }

    onClick(event){
        this.column.onClick ? this.column.onClick(event, this.row, this) : ''
    }

    updateCell(){
        this.loadHTML()
    }

    ngOnDestroy(){
        this.unsubscribe.next();
    	this.unsubscribe.complete();
    }
}