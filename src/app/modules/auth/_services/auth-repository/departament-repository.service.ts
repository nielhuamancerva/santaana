import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RolesModel } from '../../_models/Roles.model';
import { DepartamentHTTPServiceDomain } from '../auth-domain/departament-domain.service';
@Injectable({
  providedIn: 'root',
})
export class DepartamentRepositoryService {

    constructor(private _departmentservicedomain: DepartamentHTTPServiceDomain) {}

    getAllDepartament(): Observable<any> {
        return this._departmentservicedomain.getAllDepartament().pipe(
          map(
          response => {
           // console.log(response.data.content);
            return response.data.content;
          }
        ));    
      }

}