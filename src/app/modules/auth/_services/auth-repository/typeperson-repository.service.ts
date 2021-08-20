import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PagedResponse } from '../../_models/PagedResponse';
import { TypePersonModel } from '../../_models/TypePerson.model';
import { TypePersontHTTPServiceDomain } from '../auth-domain/typeperson-domain.service';
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
              //  console.log(response.data.content);
                return response.data;
            }
        ));    
    }
}