import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NoteHTTPServiceDomain } from '../../_domain/notes-domain.service';
import { NotaModel } from '../../_models/Nota.interface';

const EMPTY_NOTE: NotaModel = {
    id: undefined,
    user: '',
    title: '',
    description: '',
    fl_enabled: 1,
    fl_deleted: 0
};

@Component({
    selector: 'app-modal-notes',
    templateUrl: './modal-notes.component.html'
})
export class ModalNoteComponent implements OnInit {
    passedNote: NotaModel;
    formGroup: FormGroup;
    constructor(
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private noteService: NoteHTTPServiceDomain,

    ) { }

    ngOnInit(): void {
        this.loadNote();
    }

    loadNote() {
        if(this.passedNote == undefined){
            this.passedNote = EMPTY_NOTE;
            this.loadForm();
        }else{
            console.log(this.passedNote);
            this.loadForm();
        }
    }

    save(){
        const formValues = this.formGroup.value;
        if (this.passedNote.id!=undefined) {
            return this.noteService.UpdateNote(formValues).subscribe((response) => {
                this.formGroup.reset(),
                this.modal.close()
            });
            
        } else {
            return this.noteService.CreateNote(formValues).subscribe((response) => {
                this.formGroup.reset(),
                this.modal.close()
            });
        }
        
    }
    
    loadForm() {
        this.formGroup = this.fb.group({
            user: [this.passedNote.user, Validators.compose([Validators.required])],
            title: [this.passedNote.title, Validators.compose([Validators.required])],
            fl_enabled: [this.passedNote.fl_enabled, Validators.compose([Validators.required])],
            fl_deleted: [this.passedNote.fl_deleted, Validators.compose([Validators.required])],
            description: [this.passedNote.description, Validators.compose([Validators.required])],
            id: [this.passedNote.id],
        });
    }

}
