import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolesModel } from '../_models/Roles.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { RoleHTTPServiceDomain } from '../_services/role-domain.service';

@Injectable({
    providedIn: 'root',
})

export class RoleRepositoryService {

    constructor(
        private _roleservicedomain: RoleHTTPServiceDomain
    ) {}

    getAllRoles(): Observable<PagedResponse<RolesModel>> {
        return this._roleservicedomain.getAllRoles().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }
}