import { Injectable, ComponentRef, Injector, TemplateRef, Optional, SkipSelf, Inject, Directive, Type } from '@angular/core';
import { NiComponentBoxComponent } from './ni-component-box.component';
import { ComponentPortal, PortalInjector, ComponentType } from '@angular/cdk/portal';
import { Overlay, OverlayRef, OverlayConfig, OverlayContainer } from '@angular/cdk/overlay';
import { NiComponentBoxRef } from './ni-component-box-ref';
import { COMPONENT_BOX_CONFIG } from './ni-component-box.tokens';
import { take } from 'rxjs/operators';

export interface ComponentBoxConfig {
    panelClass?: string
    x: number
    y: number
    css?: any
    className?: any
    width?: string
    height?: string
    data?: any
}

const DEFAULT_CONFIG: ComponentBoxConfig = {
    panelClass: 'box-component',
    x: 0,
    y: 0,
    css: null,
    className: null,
    width: '200px',
    height: '200px',
    data: null
}

@Injectable({
    providedIn: 'root'
})
export abstract class _ComponentBoxBase<C> {

    constructor(
        private _overlay: Overlay, 
        private _injector: Injector,
    ) { }

	openBox<T>(componentOrTemplateRef: ComponentType<T>, config: ComponentBoxConfig = DEFAULT_CONFIG): NiComponentBoxRef<T> {
        // Override default configuration
        const boxConfig = { ...DEFAULT_CONFIG, ...config }

        // Returns an OverlayRef which is a PortalHost
        const overlayRef = this.createOverlay(boxConfig)

        // Instantiate remote control
        // const dialogContainerRef = new NiComponentBoxRef<T>(overlayRef)

        const dialogContainer = this._attachDialogContainer(overlayRef, boxConfig)

        const dialogRef = this._attachDialogContent<T>(componentOrTemplateRef,
            dialogContainer,
            overlayRef,
            boxConfig)

        overlayRef.backdropClick().subscribe(_ => dialogRef.close())

        dialogContainer.closeEvent.pipe(take(1)).subscribe(() => dialogRef.close())

        return dialogRef;
    }
    
    private createOverlay(config: ComponentBoxConfig) {
        const overlayConfig = this.getOverlayConfig(config)
        return this._overlay.create(overlayConfig)
    }
    
    private _attachDialogContainer(overlay: OverlayRef, config: ComponentBoxConfig): NiComponentBoxComponent {
        const injectionTokens = new WeakMap()
        injectionTokens.set(COMPONENT_BOX_CONFIG, config)

        const injector = new PortalInjector(this._injector, injectionTokens)

        const containerPortal = new ComponentPortal(NiComponentBoxComponent, null, injector);
        const containerRef = overlay.attach(containerPortal)
    
        return containerRef.instance
    }

    private _attachDialogContent<T>(componentOrTemplateRef: ComponentType<T>,
        dialogContainer: NiComponentBoxComponent,
        overlayRef: OverlayRef,
        config: ComponentBoxConfig): NiComponentBoxRef<T>{

        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        const dialogRef = new NiComponentBoxRef<T>(overlayRef)

        const injector = this._createInjector<T>(config, dialogRef, dialogContainer);
        const contentRef = dialogContainer.attachComponentPortal<T>(new ComponentPortal(componentOrTemplateRef, null, injector));
        dialogRef.componentInstance = contentRef.instance;

        return dialogRef;
    }
    
    private _createInjector<T>(config: ComponentBoxConfig, dialogRef: NiComponentBoxRef<T>, dialogContainer: NiComponentBoxComponent): PortalInjector {
        const injectionTokens = new WeakMap()
        
        injectionTokens.set(COMPONENT_BOX_CONFIG, config)
        injectionTokens.set(NiComponentBoxRef, dialogRef)
        injectionTokens.set(NiComponentBoxComponent, dialogContainer)
        
        return new PortalInjector(this._injector, injectionTokens)
    }
    
    private getOverlayConfig(config: ComponentBoxConfig): OverlayConfig {
        const positionStrategy = this._overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically()
    
        const overlayConfig = new OverlayConfig({
            hasBackdrop: false,
            panelClass: config.panelClass,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy
        })
    
        return overlayConfig
    }
}

@Injectable({
    providedIn: 'root'
})
export class ComponentBox extends _ComponentBoxBase<NiComponentBoxComponent> {
    constructor(
        overlay: Overlay,
        injector: Injector
    ) {
        super(overlay, injector);
    }
  }