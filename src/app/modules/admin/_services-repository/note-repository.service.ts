import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { NotaModel } from '../_models/Nota.interface';
import { NoteHTTPServiceDomain } from '../_services/note-domain.service';

@Injectable({
    providedIn: 'root',
})
export class NoteRepositoryService {

    constructor(
        private _noteservicedomain: NoteHTTPServiceDomain
    ) {}

    getAllNotes(): Observable<PagedResponse<NotaModel>> {
        return this._noteservicedomain.getAllNotes().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }
}