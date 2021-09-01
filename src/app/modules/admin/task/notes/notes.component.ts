import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNoteComponent } from './modal-note/modal-note.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {
    constructor(
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
    }

    openModal() {
        this.modalService.open(ModalNoteComponent, { size: 'lg' });
    }

}
