import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { NotaModel } from '../../_models/Nota.interface';
import { NoteRepositoryService } from '../../_services-repository/note-repository.service';
import { ModalNoteComponent } from './modal-note/modal-note.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {
    isLoading:boolean;
    $_note: Observable<NotaModel[]>;
    constructor(
        private modalService: NgbModal,
        private noteService: NoteRepositoryService,
    ) { }

    ngOnInit(): void {
        this.loadNotes();
    }

    loadNotes(){
        this.$_note=this.noteService.getAllNotes().pipe(
            map((_beneficiary)=>_beneficiary.content,
            finalize(()=>this.isLoading=false)
            )
        )
    }

    openModal() {
        this.modalService.open(ModalNoteComponent, { size: 'lg' });
    }

    editNote(note: NotaModel){
        const modalRef = this.modalService.open(ModalNoteComponent, { size: 'xl' }).componentInstance;
        modalRef.passedNote = note;
    }
}
