import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CcppHTTPServiceDomain } from '../_services/ccpp-domain.service';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { CcppModel } from '../_models/Ccpp.model';

@Injectable({
    providedIn: 'root',
})
export class CcppRepositoryService {

    constructor(
        private _ccppservicedomain: CcppHTTPServiceDomain
    ) {}

    getAllCcpp(): Observable<PagedResponse<CcppModel>> {
        return this._ccppservicedomain.getAllCcpp().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }
}