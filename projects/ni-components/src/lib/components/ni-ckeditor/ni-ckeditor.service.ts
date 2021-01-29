import { Directive, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CkEditorUploadAdapter {
    
    uploading = new BehaviorSubject<boolean>(false)
    fileUploaded = new BehaviorSubject<any>(null)
    storagePath: string

    setAdapter(editor){
        
    }

    deletedImage(URL){
        // delete image by URL
    }

}