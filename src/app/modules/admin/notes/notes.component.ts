import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NoteHTTPServiceDomain } from '../_domain/notes-domain.service';
import { NotaModel } from '../_models/Nota.interface';
import { NoteService } from '../_services/notes.service';
import { ModalNoteComponent } from './components/modal-notes.component';
const EMPTY_NOTE: NotaModel = {
    id: undefined,
    user: '',
    title: '',
    description: '',
    fl_enabled: 1,
    fl_deleted: 0
};
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
        private noteService: NoteService,
        public notesServiceDomain: NoteHTTPServiceDomain
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