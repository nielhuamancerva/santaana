import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PagedResponse } from '../../_models/PagedResponse';
import { TypeDocumentModel } from '../../_models/TypeDocument.model';
import { TypeDocumentHTTPServiceDomain } from '../auth-domain/typedocument-domain.service';
@Injectable({
  providedIn: 'root',
})
export class TypeDocumentRepositoryService {

    constructor(
        private _typedocumentservicedomain: TypeDocumentHTTPServiceDomain
    ) {}

    getAllTypedocument(): Observable<PagedResponse<TypeDocumentModel>> {
        return this._typedocumentservicedomain.getAllTypedocument().pipe(
            map(
            response => {
             //console.log(response.data);
                return response.data;
            }
        ));    
    }
}