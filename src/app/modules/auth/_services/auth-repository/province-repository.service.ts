import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RolesModel } from '../../_models/Roles.model';
import { ProvinceHTTPServiceDomain } from '../auth-domain/province-domain.servie';
@Injectable({
  providedIn: 'root',
})
export class ProvinceRepositoryService {

    constructor(private _provinceservicedomain: ProvinceHTTPServiceDomain) {}

    getAllProvince(): Observable<any> {
        return this._provinceservicedomain.getAllProvince().pipe(
          map(
          response => {
          //  console.log(response.data.content);
            return response.data.content;
          }
        ));    
      }

}