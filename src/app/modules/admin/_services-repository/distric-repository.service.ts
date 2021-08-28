import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DistrictHTTPServiceDomain } from '../_services/district-domain.service';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { DistrictModel } from '../_models/District.model';

@Injectable({
    providedIn: 'root',
})

export class DistrictRepositoryService {

    constructor(
        private _districtservicedomain: DistrictHTTPServiceDomain
    ) {}

    getAllDistrict(codedistrict): Observable<PagedResponse<DistrictModel>> {
        return this._districtservicedomain.getAllDistrict(codedistrict).pipe(
            map(
            response => {
               // console.log(response)
                return response.data;
            }
        ));    
    }

    getByDistrict(code): Observable<PagedResponse<DistrictModel>> {
        return this._districtservicedomain.getByDistrict(code).pipe(
            map(
            response => {
            //    console.log(response.data);
                return response.data;
            }
        ));    
    }
}