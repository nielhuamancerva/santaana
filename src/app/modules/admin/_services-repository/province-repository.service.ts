import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProvinceHTTPServiceDomain } from '../_services/province-domain.service';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { ProvinceModel } from '../_models/Province.model';

@Injectable({
    providedIn: 'root',
})
export class ProvinceRepositoryService {

    constructor(
        private _provinceservicedomain: ProvinceHTTPServiceDomain
    ) {}

    getAllProvince(): Observable<PagedResponse<ProvinceModel>> {
        return this._provinceservicedomain.getAllProvince().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }
}