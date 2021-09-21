import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { DepartamentModel } from '../_models/Departament.model';
import { DepartamentDomainService } from '../_domain/departament-domain.service';

@Injectable({
    providedIn: 'root',
})

export class DepartamentRepositoryService {

    constructor(
        private _departmentservicedomain: DepartamentDomainService
    ) {}

    getAllDepartament(): Observable<PagedResponse<DepartamentModel>> {
        return this._departmentservicedomain.getAllDepartament().pipe(
            map(
            response => {
                //console.log(response.data);
                return response.data;
            }
        ));    
    }
    getByDepartament(code): Observable<DepartamentModel> {
        return this._departmentservicedomain.getByDepartament(code).pipe(
            map(
            response => {
                //console.log(response.data);
                return response.data.content[0];
            }
        ));    
    }

    getByDepartament2(code): Observable<PagedResponse<DepartamentModel>> {
        return this._departmentservicedomain.getByDepartament(code).pipe(
            map(
            response => {
                //console.log(response.data);
                return response.data;
            }
        ));    
    }
}