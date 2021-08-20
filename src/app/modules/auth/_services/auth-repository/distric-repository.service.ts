import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RolesModel } from '../../_models/Roles.model';
import { DistrictHTTPServiceDomain } from '../auth-domain/distric-domain.service';
@Injectable({
  providedIn: 'root',
})
export class DistrictRepositoryService {

    constructor(private _districtservicedomain: DistrictHTTPServiceDomain) {}

    getAllDistrict(): Observable<any> {
        return this._districtservicedomain.getAllDistrict().pipe(
          map(
          response => {
           // console.log(response.data.content);
            return response.data.content;
          }
        ));    
      }

}