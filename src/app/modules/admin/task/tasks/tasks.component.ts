import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalTaskComponent } from './modal-task/modal-task.component'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
    
    constructor(
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        
    }

    openModal() {
        this.modalService.open(ModalTaskComponent, { size: 'lg' });
    }
}
