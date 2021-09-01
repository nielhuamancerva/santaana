import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-note',
  templateUrl: './modal-note.component.html'
})
export class ModalNoteComponent implements OnInit {

    formGroup: FormGroup;
    constructor(
        private fb: FormBuilder,
        public modal: NgbActiveModal,
    ) { }

    ngOnInit(): void {
        this.loadForm();
    }

    save(){
        this.formGroup.reset();
    }
    
    loadForm() {
        this.formGroup = this.fb.group({
            userName: ['', Validators.compose([Validators.required])],
            title: ['', Validators.compose([Validators.required])],
            createdAt: ['', Validators.compose([Validators.required])],
            caducedAt: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])]
        });
    }

}
