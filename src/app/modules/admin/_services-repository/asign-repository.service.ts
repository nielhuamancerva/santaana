import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { SalesModel } from '../_models/Sales.model';
import { UserModel } from '../_models/user.model';
import { UserAsignHTTPServiceDomain } from '../_services/asign-domain.service';

@Injectable({
    providedIn: 'root',
})
export class AsignRepositoryService {

    constructor(private _asignservicedomain: UserAsignHTTPServiceDomain) {}

    getAllUserAsign(): Observable<any> {
        return this._asignservicedomain.getAllUserAsign().pipe(
            map(
            response => {
             console.log(response.data);
                return response.data;
            }
        ));    
    }
}