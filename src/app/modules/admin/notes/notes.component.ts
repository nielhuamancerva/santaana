import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { NoteHTTPServiceDomain } from '../_domain/notes-domain.service';
import { NotaModel } from '../_models/Nota.interface';
import { NoteService } from '../_services/notes.service';
import { ModalNoteComponent } from './components/modal-notes.component';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {

    paginator: PaginatorState;
    isLoading:boolean;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        public _noteService: NoteService,
        public notesServiceDomain: NoteHTTPServiceDomain
    ) { }

    ngOnInit(): void {
        this.searchForm();
        this._noteService.fetch();
        this.paginator = this._noteService.paginator;
        const sb = this._noteService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
        
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            title: [''],
            user: [''],
        });

        const searchTitle = this.searchGroup.controls.title.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchTitle(val));

        this.subscriptions.push(searchTitle);

        const searchUser = this.searchGroup.controls.user.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchUser(val));
            
        this.subscriptions.push(searchUser);
    }

    searchTitle(searchTerm: string) {
        this._noteService.patchState({ searchTerm });
    }

    searchUser(searchAux1: string) {
        this._noteService.patchState({ searchAux1 });
    }

    paginate(paginator: PaginatorState) {
        this._noteService.patchState({ paginator });
    }

    openModal() {
        this.editNote(undefined);
    }

    editNote(note: NotaModel) {
        const modalRef = this.modalService.open(ModalNoteComponent, { size: 'xl' });
        modalRef.componentInstance.passedNote = note;
        modalRef.result.then(() =>
            this._noteService.fetch(),
            () => { }
        );
    }
}