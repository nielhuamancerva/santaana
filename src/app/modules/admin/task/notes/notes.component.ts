import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {
    formGroup: FormGroup;
    constructor(
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        this.formGroup = this.fb.group({
            title: ['', Validators.compose([Validators.required])],
            createdAt: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])]
        });
    }

    save(){
        this.formGroup.reset();
    }

}
