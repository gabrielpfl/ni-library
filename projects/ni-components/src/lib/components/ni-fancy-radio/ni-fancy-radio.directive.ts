import { Directive, HostListener, Output, Input, EventEmitter, OnInit, OnDestroy, ContentChild, ElementRef, AfterContentInit } from '@angular/core';
import { NiFancyRadioComponent } from './ni-fancy-radio.component';

@Directive({
    selector:'ni-fancy-radio ni-fancy-radio-choice'
})
export class FancyRadioChoiceDirective implements OnInit, OnDestroy, AfterContentInit {
    @Input() value
    @ContentChild(FancyRadioChoiceDirective, { read: ElementRef, static: false }) choice: ElementRef

    constructor(private fancyRadio:NiFancyRadioComponent){
    }

    ngAfterContentInit(){
        if(this.value == this.fancyRadio.value){
            this.choice.nativeElement.classList.add("active")
        }
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

    @HostListener('click', ['$event'])
    clickEvent(value) {
        this.fancyRadio.selectChoice(this.value)
        this.choice.nativeElement.classList.add("active")
    }
  
}