import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { TypePersonModel } from '../_models/TypePerson.model';
import { TypePersontHTTPServiceDomain } from '../_services/typeperson-domain.service';

@Injectable({
    providedIn: 'root',
})

export class TypePersonRepositoryService {

    constructor(
        private _typepersonservicedomain: TypePersontHTTPServiceDomain
    ) {}

    getAllTypeperson(): Observable<PagedResponse<TypePersonModel>> {
        return this._typepersonservicedomain.getAllTypeperson().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }
}