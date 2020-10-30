import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NiComponentBoxRef<T, R = any> {

    componentInstance: T

    private readonly _afterClosed = new Subject<R | undefined>();

    constructor(
        private overlayRef: OverlayRef,
    ) { 
    }

    close(result?: R): void {
        this.overlayRef.dispose()
        this._afterClosed.next(result)
    }

    afterClosed(): Observable<R | undefined> {
        return this._afterClosed
    }
}
