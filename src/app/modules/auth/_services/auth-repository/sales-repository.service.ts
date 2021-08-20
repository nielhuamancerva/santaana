import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PagedResponse } from '../../_models/PagedResponse';
import { SalesModel } from '../../_models/Sales.model';
import { SalesHTTPServiceDomain } from '../auth-domain/sales-domain.service';
@Injectable({
  providedIn: 'root',
})
export class SalesRepositoryService {

    constructor(private _saleservicedomain: SalesHTTPServiceDomain) {}

    getAllSales(): Observable<PagedResponse<SalesModel>> {
        return this._saleservicedomain.getAllSales().pipe(
          map(
          response => {
           // console.log(response);
            return response.data;
          }
        ));    
      }

}