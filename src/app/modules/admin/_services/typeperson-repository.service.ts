import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { TypePersontDomainService } from '../_domain/type-person-domain.service';
import { TypePersonModel } from '../_models/TypePerson.model';


@Injectable({
    providedIn: 'root',
})

export class TypePersonRepositoryService {

    constructor(
        private _typepersonservicedomain: TypePersontDomainService
    ) {}

    getAllTypeperson(): Observable<TypePersonModel[]> {
        return this._typepersonservicedomain.getAllTypeperson().pipe(
            map(
            response => {
                return response.data.content;
            }
        ));    
    }
}