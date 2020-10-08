import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
    providedIn: 'root'
})
export class NiComponentBoxRef<T> {

    componentInstance: T

    constructor(
        private overlayRef: OverlayRef,
    ) { 
    }

    close(): void {
        this.overlayRef.dispose();
    }
}
