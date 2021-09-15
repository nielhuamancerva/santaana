import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolesModel } from '../_models/Roles.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { RoleDomainService } from '../_domain/role-domain.service';

@Injectable({
    providedIn: 'root',
})

export class RoleRepositoryService {

    constructor(
        private _roleservicedomain: RoleDomainService
    ) {}

    getAllRoles(page:number, size: number, type?:string, name?:string): Observable<RolesModel[]> {
        return this._roleservicedomain.getAllRoles(page,size,type,name).pipe(
            map(
            response => {
                return response.data.content;
            }
        ));    
    }
}