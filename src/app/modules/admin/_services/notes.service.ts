import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { NotaModel } from '../_models/Nota.interface';
import { NoteHTTPServiceDomain } from '../_domain/notes-domain.service';

@Injectable({
    providedIn: 'root',
})
export class NoteService {

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