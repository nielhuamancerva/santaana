import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-upload-file',
    templateUrl: './modal-upload-file.component.html',
    styleUrls: ['./modal-upload-file.component.scss']
})
export class ModalUploadFileComponent implements OnInit {

    archivoUploaded: File;
    archivoSelected:  String | ArrayBuffer;
    constructor(
        public modal: NgbActiveModal,
    ) { }

    ngOnInit(): void {
    }

    onSelectFile(event){
        console.log(event);
        if(event.target.files && event.target.files[0])
        {
            this.archivoUploaded = <File>event.target.files[0];
            const reader = new FileReader();
            reader.onload= e => this.archivoSelected = reader.result;
            reader.readAsDataURL(this.archivoUploaded);
        }
        console.log(this.archivoUploaded);
    }

    enviarArchivo(){

    }
}
