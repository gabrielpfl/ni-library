import {Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnInit, Renderer2, AfterViewInit} from '@angular/core';
//import * as ColumnResizer from 'column-resizer'
import * as stringHash from 'string-hash';

@Directive({
  selector: '[ngInit]'
})
export class NgInitDirective {

  @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    setTimeout(() => this.initEvent.emit(), 10);
  }

}

@Directive({
  selector: '[clickOutside]'
})
export class NiClickOutsideDirective implements OnInit {

	@Input() dismissElements: any[] = []

	constructor(private _elementRef: ElementRef) { }

	ngOnInit(){
		this.dismissElements = [...this.dismissElements, this._elementRef]
	}

	@Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

	@HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
		//let clickedInside = this._elementRef.nativeElement.contains(targetElement);
		const clickedInside = this.dismissElements.some((el: any) => {
			return el.nativeElement.contains(targetElement)
		})
		if (!clickedInside) {
			this.clickOutside.emit(null);
		}
	}

}