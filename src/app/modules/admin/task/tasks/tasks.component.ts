import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
    formGroup: FormGroup;
    constructor(
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.loadForm();
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

    save(){
        this.formGroup.reset();
    }

}
