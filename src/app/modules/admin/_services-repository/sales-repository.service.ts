import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { SalesModel } from '../_models/Sales.model';
import { SalesHTTPServiceDomain } from '../_services/sales-domain.service';

@Injectable({
    providedIn: 'root',
})
export class SalesRepositoryService {

    constructor(private _saleservicedomain: SalesHTTPServiceDomain) {}

    getAllSales(): Observable<PagedResponse<SalesModel>> {
        return this._saleservicedomain.getAllSales().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }
}