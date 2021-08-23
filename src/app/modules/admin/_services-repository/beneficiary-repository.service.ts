import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BeneficiaryModel } from '../_models/Beneficiary.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BeneficiaryHTTPServiceDomain } from '../_services/beneficiary-domain.service';

@Injectable({
    providedIn: 'root',
})

export class BeneficiaryRepositoryService {

    constructor(
        private _beneficiaryservicedomain: BeneficiaryHTTPServiceDomain
    ) {}

    getAllBeneficiary(varr): Observable<PagedResponse<BeneficiaryModel>> {
        return this._beneficiaryservicedomain.getAllBeneficiary(varr).pipe(
            map(
                response => {
                console.log(response.data.content);
                return response.data;
            }
        ));    
    }
}