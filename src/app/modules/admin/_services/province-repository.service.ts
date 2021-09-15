import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { ProvinceModel } from '../_models/Province.model';
import { ProvinceDomainService } from '../_domain/province-domain.service';

@Injectable({
    providedIn: 'root',
})
export class ProvinceRepositoryService {

    constructor(
        private _provinceservicedomain: ProvinceDomainService
    ) {}

    getAllProvince(code): Observable<PagedResponse<ProvinceModel>> {
        return this._provinceservicedomain.getAllProvince(code).pipe(
            map(
            response => {
            //    console.log(response)
                return response.data;
            }
        ));    
    }

    getByProvince(code): Observable<PagedResponse<ProvinceModel>> {
        return this._provinceservicedomain.getByProvince(code).pipe(
            map(
            response => {
            //    console.log(response.data);
                return response.data;
            }
        ));    
    }
}