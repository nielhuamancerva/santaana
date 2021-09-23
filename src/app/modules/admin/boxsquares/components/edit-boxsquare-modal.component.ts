import { BoxSquaresService } from './../../_services/boxsquares.service';
import { FileService } from './../../_services/file.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxSquareModel } from '../../_models/boxsquare.model';
import { HttpResponse } from '@angular/common/http';
import { ImageModel } from '../../_models/Image.model';
/*import { saveAs } from 'file-saver';*/

@Component({
  selector: 'app-edit-boxsquare-modal',
  templateUrl: './edit-boxsquare-modal.component.html'
})
export class EditBoxSquareModalComponent implements OnInit, OnDestroy {
 
    @Input() $_boxSquare: BoxSquareModel;
    formGroup: FormGroup;
    fileDownload: ImageModel[] = [];
    $_urls: BehaviorSubject<ImageModel[]> = new BehaviorSubject<ImageModel[]>([]); 
    private subscriptions: Subscription[] = [];
        
    constructor(public modal: NgbActiveModal,
                private _fileService: FileService,
                private _boxSquaresService: BoxSquaresService,
                private fb: FormBuilder) { }

    ngOnInit(): void {
        this.loadFormGroup();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }



    loadFormGroup() {
        this.formGroup = this.fb.group({
            note:['', ],
            balance: ['', Validators.compose([Validators.required])],
            totalcharged: ['', Validators.compose([Validators.required])],
            commission: ['', Validators.compose([Validators.required])],
            totalpay: ['', Validators.compose([Validators.required])],
            state: ['', Validators.compose([Validators.required])],
            fileSource: ['', Validators.compose([Validators.required])]
        });

        this.subscriptions.push(
            this.formGroup.controls.fileSource.valueChanges.subscribe((value) =>
                this.$_urls.next(value)
            )
        );

        this.loadBoxSquare();
    }

    private prepareInternalUser() {
        const formData = this.formGroup.value;
        this.$_boxSquare.balance = formData.balance;
        this.$_boxSquare.state  = formData.state;
        this.$_boxSquare.note = formData.note;


    }


    loadBoxSquare() {
        if (this.$_boxSquare) {

            this.formGroup.get('state').patchValue(this.$_boxSquare.state);
            this.formGroup.get('note').patchValue(this.$_boxSquare.note);
            this.formGroup.get('totalcharged').patchValue(this.$_boxSquare.totalcharged);
            this.formGroup.get('commission').patchValue(this.$_boxSquare.commission);
            this.formGroup.get('totalpay').patchValue(this.$_boxSquare.totalpay);
            this.formGroup.get('balance').patchValue(this.$_boxSquare.balance);

            this.$_boxSquare.files.forEach(file => {
                const _img = this._fileService.getFile(file).subscribe( (response: HttpResponse<Blob>)  => {
              
                    // Extract content disposition header
                   const contentDisposition = response.headers.get('Content-Disposition');
    
                   // Extract the file name
                   const filename = contentDisposition
                           .split(';')[1]
                           .split('filename')[1]
                           .split('=')[1]
                           .trim()
                           .match(/"([^"]+)"/)[1];
                    let file : ImageModel = {file: response.body, name: filename, type: response.body.type}
                    const reader = new FileReader();
                    reader.onload= e => file.fileread = reader.result;
                    reader.readAsDataURL(response.body);
                   
                   this.fileDownload.push(file);
                   this.formGroup.get('fileSource').patchValue(this.fileDownload);
               });
    
               this.subscriptions.push(_img);
            })
            
                        
        }       
    }

    download(file: ImageModel) {
        var blob = new Blob([file.file], {type:file.type});
      /*  saveAs(blob, file.name)*/
    }



    save() {
        this.prepareInternalUser();

        const updaterBoxSquare = this._boxSquaresService.updater(this.$_boxSquare.id, this.$_boxSquare).subscribe( response  => {
            if(response.success) {
                console.log("Cierre actualizado");
                this.modal.close();
            } else {
                console.log("No se actualizo cierre");
            }
        });
        
        
        this.subscriptions.push(updaterBoxSquare);
    }

    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

}