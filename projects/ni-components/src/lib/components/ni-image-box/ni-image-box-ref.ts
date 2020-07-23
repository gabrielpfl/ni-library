import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NiImageBoxOverlayRef {

    constructor(private overlayRef: OverlayRef) { }

    close(): void {
        this.overlayRef.dispose();
    }
}
