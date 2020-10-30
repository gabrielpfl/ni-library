import { Directive, ElementRef, EventEmitter, HostListener, NgZone, Output } from '@angular/core';

@Directive({
    selector: '[niClickable]',
})
export class NiClickDirective {

    @Output() onClick = new EventEmitter<MouseEvent>()

    constructor(private elementRef: ElementRef, private zone: NgZone){
        this.zone.runOutsideAngular(() => {
            const el = this.elementRef.nativeElement as HTMLElement;
            el.addEventListener('click', (event: MouseEvent) => {
                console.log(event)
                this.zone.run(() => this.onClick.emit(event));
            })      
        })
    }

    // @HostListener('click', ['$event']) onElmClick(event: MouseEvent) {
    //     // const targetElement = event.target as HTMLElement;

    //     // // Check if the click was outside the element
    //     // if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
    //     //     this.clickElsewhere.emit(event);
    //     // }

    //     this.onClick.emit(event)
	// }

}