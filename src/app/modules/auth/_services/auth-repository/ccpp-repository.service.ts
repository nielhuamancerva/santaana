import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RolesModel } from '../../_models/Roles.model';
import { CcppHTTPServiceDomain } from '../auth-domain/ccpp-domain.service';
@Injectable({
  providedIn: 'root',
})
export class CcppRepositoryService {

    constructor(private _ccppservicedomain: CcppHTTPServiceDomain) {}

    getAllCcpp(): Observable<any> {
        return this._ccppservicedomain.getAllCcpp().pipe(
          map(
          response => {
         //   console.log(response.data.content);
            return response.data.content;
          }
        ));    
      }

}