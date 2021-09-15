import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { CcppDomainService } from '../_domain/ccpp-domain.service';
import { CcppModel } from '../_models/Ccpp.model';

@Injectable({
    providedIn: 'root',
})
export class CcppRepositoryService {

    constructor(
        private _ccppservicedomain: CcppDomainService
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