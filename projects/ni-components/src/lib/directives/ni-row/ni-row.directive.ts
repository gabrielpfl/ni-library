import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
    selector: '[ni-row]',
})
export class NiRow implements OnInit {

    @Input() data: any
    @Input() index: number

    updateRowData = new BehaviorSubject<any>(null)

    constructor(private elementRef: ElementRef){
    }

    ngOnInit(){
    }

    updateData(data){
        this.data = data
        this.updateRowData.next(data)
    }

}