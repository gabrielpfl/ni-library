import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, QueryList, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NiRow } from '../../directives/ni-row/ni-row.directive';

@Component({
    selector: 'ni-column-content',
    templateUrl: './ni-column-content.component.html',
    styleUrls: ['./ni-column-content.component.scss'],
    host: {
        '[innerHTML]': 'safeHtml',
        '(click)': 'onClick($event)',
        // '(mouseenter)': 'onMouseEnter()',
        // '(mouseleave)': 'onMouseLeave()',
    },
})
export class NiColumnContentComponent implements OnInit, OnDestroy {

    @Input() column
    @Input() rows: QueryList<NiRow>
    @Input() index

    row: NiRow

    private _safeHtml: SafeHtml
    
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

    ngOnInit(){
        // Window[`NiColumnContentComponent${this.index}`] = this;
        // this.elementRef.nativeElement.innerHTML = safeHtml['changingThisBreaksApplicationSecurity']

        this.rows.changes.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            const rows = this.rows.toArray()
            console.log(rows)
            this.row = rows.length ? rows[this.index] : null
            if(this.row){
                this.loadHTML()
            }
        })
    }

    loadHTML(){
        this.safeHtml = this.getHTML()
    }

    getHTML(){
        // const html: any = this.column?.content ? `<span class="col-content" onclick="Window.NiColumnContentComponent${this.index}.onClick(event)">${this.column.content(this.row)}</span>` : ''
        const html: any = this.column?.content ? this.column.content(this.row.data) : ''
        return this.sanitizer.bypassSecurityTrustHtml(html)
    }

    onClick(event){
        this.column.onClick ? this.column.onClick(event, this.row) : ''
    }

    ngOnDestroy(){
        this.unsubscribe.next();
    	this.unsubscribe.complete();
    }
}