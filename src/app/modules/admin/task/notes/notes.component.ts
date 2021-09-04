import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NotaModel } from '../../_models/Nota.interface';
import { NoteRepositoryService } from '../../_services-repository/note-repository.service';
import { NoteHTTPServiceDomain } from '../../_services/note-domain.service';
import { ModalNoteComponent } from './modal-note/modal-note.component';

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
        private noteService: NoteRepositoryService,
        public notesServiceDomain: NoteHTTPServiceDomain,
    ) { }

    ngOnInit(): void {
        this.loadNotes();
        const sb = this.notesServiceDomain.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
        this.notesServiceDomain.fetch();
    }

    loadNotes(){
        this.isLoading=true;
        this.$_note=this.noteService.getAllNotes().pipe(
            map((_beneficiary)=>_beneficiary.content,
            finalize(()=>this.isLoading=false)
            )
        )
    }

    openModal() {
        const modalRef = this.modalService.open(ModalNoteComponent, { size: 'lg' });
        modalRef.result.then(() =>
            this.notesServiceDomain.fetch(),
            () => { }
        );
    }

    editNote(note: NotaModel){
        const modalRef = this.modalService.open(ModalNoteComponent, { size: 'xl' });
        modalRef.componentInstance.passedNote = note;
        modalRef.result.then(() =>
            this.notesServiceDomain.fetch(),
            () => { }
        );
    }
}