import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { TypeDocumentModel } from '../_models/TypeDocument.model';
import { TypeDocumentHTTPServiceDomain } from '../_services/typedocument-domain.service';
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
                return response.data;
            }
        ));    
    }
}