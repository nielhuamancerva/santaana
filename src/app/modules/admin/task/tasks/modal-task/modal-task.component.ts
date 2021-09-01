import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-task',
    templateUrl: './modal-task.component.html'
})

export class ModalTaskComponent implements OnInit {

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
