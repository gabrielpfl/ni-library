import { Component, Inject, ViewChild, ComponentRef, EventEmitter } from '@angular/core';
import { COMPONENT_BOX_CONFIG } from './ni-component-box.tokens';
import { ComponentBoxConfig } from './ni-component-box.service';
import { ComponentPortal, CdkPortalOutletAttachedRef, CdkPortalOutlet } from '@angular/cdk/portal';

@Component({
  selector: 'ni-component-box',
  templateUrl: './ni-component-box.component.html',
  styleUrls: ['./ni-component-box.component.css'],
})
export class NiComponentBoxComponent {

    closeEvent = new EventEmitter()

    @ViewChild(CdkPortalOutlet, {static: true}) _portalOutlet: CdkPortalOutlet;

	constructor(
        @Inject(COMPONENT_BOX_CONFIG) public boxConfig: ComponentBoxConfig,
    ) { 
    }

    closeBox(){
        this.closeEvent.emit()
    }

    loaded(ref: CdkPortalOutletAttachedRef) {
        // ref = ref as ComponentRef<ComponentPortalExample>;
        // ref.instance.message = 'zap';
        // console.log(ref)
    }

    /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Already attached');
        }

        return this._portalOutlet.attachComponentPortal(portal);
    }
}