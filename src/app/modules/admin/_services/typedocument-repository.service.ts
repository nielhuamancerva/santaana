import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { TypeDocumentDomainService } from '../_domain/type-document-domain.service';
import { TypeDocumentModel } from '../_models/TypeDocument.model';

@Injectable({
  providedIn: 'root',
})
export class TypeDocumentRepositoryService {

    constructor(
        private _typedocumentservicedomain: TypeDocumentDomainService
    ) {}

    getAllTypedocument(): Observable<TypeDocumentModel[]> {
        return this._typedocumentservicedomain.getAllTypedocument().pipe(
            map(
            response => {
                return response.data.content;
            }
        ));    
    }
}