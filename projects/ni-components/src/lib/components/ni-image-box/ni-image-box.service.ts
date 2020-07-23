import { Injectable, ComponentRef, Injector} from '@angular/core';
import { NiImageBoxComponent } from './ni-image-box.component';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { NiImageBoxOverlayRef } from './ni-image-box-ref';
import { IMAGE_BOX_DATA } from './ni-image-box.tokens';

export interface Image {
    url: string
    x: number
    y: number
}

export interface ImageBoxConfig {
    panelClass?: string
    image?: Image
}

const DEFAULT_CONFIG: ImageBoxConfig = {
    panelClass: 'box-image',
    image: null
}

@Injectable({
    providedIn: 'root'
})
export class ImageBox {
    componentPortal: ComponentPortal<NiImageBoxComponent>

    constructor(private overlay: Overlay, private injector: Injector) { }

	openBox(config: ImageBoxConfig = {}) {
        // Override default configuration
        const boxConfig = { ...DEFAULT_CONFIG, ...config }

        // Returns an OverlayRef which is a PortalHost
        const overlayRef = this.createOverlay(boxConfig)

        // Instantiate remote control
        const dialogRef = new NiImageBoxOverlayRef(overlayRef)

        const overlayComponent = this.attachDialogContainer(overlayRef, boxConfig, dialogRef)

        overlayRef.backdropClick().subscribe(_ => dialogRef.close())

        return dialogRef;
    }
    
    private createOverlay(config: ImageBoxConfig) {
        const overlayConfig = this.getOverlayConfig(config)
        return this.overlay.create(overlayConfig)
    }
    
    private attachDialogContainer(overlayRef: OverlayRef, config: ImageBoxConfig, dialogRef: NiImageBoxOverlayRef) {
        const injector = this.createInjector(config, dialogRef)
    
        const containerPortal = new ComponentPortal(NiImageBoxComponent, null, injector)
        const containerRef: ComponentRef<NiImageBoxComponent> = overlayRef.attach(containerPortal)
    
        return containerRef.instance
    }
    
    private createInjector(config: ImageBoxConfig, dialogRef: NiImageBoxOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap()
    
        injectionTokens.set(NiImageBoxOverlayRef, dialogRef)
        injectionTokens.set(IMAGE_BOX_DATA, config.image)
    
        return new PortalInjector(this.injector, injectionTokens)
    }
    
    private getOverlayConfig(config: ImageBoxConfig): OverlayConfig {
        const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically()
    
        const overlayConfig = new OverlayConfig({
            hasBackdrop: false,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        })
    
        return overlayConfig
    }
}