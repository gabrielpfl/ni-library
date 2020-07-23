import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { NiImageBoxOverlayRef } from './ni-image-box-ref';
import { IMAGE_BOX_DATA } from './ni-image-box.tokens';
import { Image } from './ni-image-box.service';

@Component({
  selector: 'ni-image-box',
  templateUrl: './ni-image-box.component.html',
  styleUrls: ['./ni-image-box.component.css'],
})
export class NiImageBoxComponent {

    contextMenuPosition = { x: '0px', y: '0px' }

	constructor(
        public dialogRef: NiImageBoxOverlayRef,
        @Inject(IMAGE_BOX_DATA) public image: Image
    ) { }

    closeBox(){
        this.dialogRef.close()
    }
}