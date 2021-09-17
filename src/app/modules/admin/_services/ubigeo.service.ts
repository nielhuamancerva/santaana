import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { UbigeoHTTPServiceDomain } from '../_domain/ubigeo-domain.service';
import { DepartamentModel } from '../_models/Departament.model';
import { UserAsingModel } from '../_models/UserAsign.model';

@Injectable({
    providedIn: 'root',
})
export class UbigeoService extends TableService<DepartamentModel> implements OnDestroy{

    constructor(
        @Inject(HttpClient) http,
        private _ubigeoservicedomain: UbigeoHTTPServiceDomain
    ) {
        super(http);
    }

    find(tableState: ITableState): Observable<TableResponseModel<any>> {
        console.log("ejecutando")
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let title = tableState.searchTerm;
        let user = tableState.searchAux1;
    
        return this._ubigeoservicedomain.getUbigeos(page , size, title, user).pipe(
        map(
        response => {
            let result: TableResponseModel<any> = {
                items: response.data,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            console.log(result)
            return result;
        }
        ));
    }

    getAllUserAsign(): Observable<any> {
        return this._ubigeoservicedomain.getAllUserAsign().pipe(
            map(
            response => {
             console.log(response.data);
                return response.data;
            }
        ));    
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}