import { Directive, HostListener, Output, Input, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NiSelect } from './ni-select.component';

@Directive({
    selector:'ni-select'
})
export class SelectDirective implements OnInit, OnDestroy {
  
    focus: boolean = false;
    //@Input() value
    @Input() dataSource

    @Output() debounceClick = new EventEmitter();
    private clicks = new Subject();
    private filterValue = new Subject();
    private subscription: Subscription;
    
    ngOnInit() {
        //console.log(this.dataSource)
        //console.log(this.value)
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }

    @HostListener('click')
    onFocus(){
        this.focus = true; // Catching native input's focus 
    }
    
    @HostListener('mouseout')
    onBlur(){
        this.focus = false;
    }

    @HostListener('click', ['$event'])
    clickEvent(event) {
        //console.log(this.value)
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
  
}


@Directive({
    selector:'[NiSelectInput]'
})
export class SelectInputDirective implements OnInit, OnDestroy {

    //@Output() inputChange = new EventEmitter()
    //@Output() afterInputEnter = new EventEmitter()

    constructor(private selectComponent:NiSelect){
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

    @HostListener('window:keyup', ['$event.target.value'])
    inputChanged(value) {
        //console.log(value)
        //this.inputChange.emit(value)
    }

    @HostListener('window:keyup.enter', ['$event.target.value'])
    inputEntered(value) {
        //console.log(value)
        //this.afterInputEnter.emit(value)
        this.selectComponent.showLoader = true
        this.selectComponent.searchOnEnter(value)
    }
  
}

@Directive({
    selector:'ni-select ni-option'
})
export class SelectOptionDirective implements OnInit, OnDestroy {
    @Input() value

    constructor(private selectComponent:NiSelect){
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

    @HostListener('click', ['$event'])
    clickEvent(value) {
        this.selectComponent.selectChoice(this.value)
    }
  
}