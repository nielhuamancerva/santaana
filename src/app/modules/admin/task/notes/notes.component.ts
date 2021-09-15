import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NotaModel } from '../../_models/Nota.interface';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {
    isLoading:boolean;
    $_note: Observable<NotaModel[]>;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,

    ) { }

    ngOnInit(): void {
        this.loadNotes();
     

    }

    loadNotes(){
  
    }

    openModal() {

    }

    editNote(note: NotaModel){
 
    }
}