import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { DepartamentHTTPServiceDomain } from '../_services/departament-domain.service';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { DepartamentModel } from '../_models/Departament.model';

@Injectable({
    providedIn: 'root',
})

export class DepartamentRepositoryService {

    constructor(
        private _departmentservicedomain: DepartamentHTTPServiceDomain
    ) {}

    getAllDepartament(): Observable<PagedResponse<DepartamentModel>> {
        return this._departmentservicedomain.getAllDepartament().pipe(
            map(
            response => {
                console.log(response.data);
                return response.data;
            }
        ));    
    }
}