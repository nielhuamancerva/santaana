import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RolesModel } from '../../_models/Roles.model';
import { RoleHTTPServiceDomain } from '../auth-domain/role-domain.service';
@Injectable({
  providedIn: 'root',
})
export class RoleRepositoryService {

    constructor(private _roleservicedomain: RoleHTTPServiceDomain) {}

    getAllRoles(): Observable<any> {
        return this._roleservicedomain.getAllRoles().pipe(
          map(
          response => {
            return response.data.content;
          }
        ));    
      }

}