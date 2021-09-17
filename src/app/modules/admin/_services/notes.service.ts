import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { NotaModel } from '../_models/Nota.interface';
import { NoteHTTPServiceDomain } from '../_domain/notes-domain.service';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class NoteService extends TableService<NotaModel> implements OnDestroy{

    constructor(
        @Inject(HttpClient) http,
        private _noteservicedomain: NoteHTTPServiceDomain
    ) {
        super(http);
    }

    find(tableState: ITableState): Observable<TableResponseModel<NotaModel>> {
        console.log("ejecute aqui")
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let title = tableState.searchTerm;
        let user = tableState.searchAux1;
    
        return this._noteservicedomain.getNotes(page , size, title, user).pipe(
        map(
        response => {
            let result: TableResponseModel<NotaModel> = {
                items: response.data.content,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            return result;
        }
        ));
    }

    getAllNotes(): Observable<PagedResponse<NotaModel>> {
        return this._noteservicedomain.getAllNotes().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}