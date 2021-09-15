import { BoxSquareModel } from './../_models/boxsquare.model';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { BoxSquareDomainService } from '../_domain/boxsquare-domain.service';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class BoxSquaresService extends TableService<BoxSquareModel> implements OnDestroy {

    constructor(@Inject(HttpClient) http, private _boxSquareDomainService: BoxSquareDomainService) {
        super(http);
      }

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<BoxSquareModel>> {
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let agent = tableState.searchTerm;
        let state = tableState.searchAux10;
        let dateIn = tableState.searchAux3;
        let dateFn = tableState.searchAux4;

        return this._boxSquareDomainService.getBoxSquareList(page , size, agent, state, dateIn, dateFn).pipe(
        map(
        response => {
            let result: TableResponseModel<BoxSquareModel> = {
                items: response.data.content,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            
            return result;
        }
        ));    
    }


    register(_data: FormData) : Observable<ApiResponse<BoxSquareModel>>{
        return this._boxSquareDomainService.createBoxSquare(_data);      
    }

    updater(id: string, _data: BoxSquareModel) : Observable<ApiResponse<BoxSquareModel>>{
        return this._boxSquareDomainService.updateBoxSquare(id, _data);      
    }
    

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}