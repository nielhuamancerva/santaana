import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { TaskHTTPServiceDomain } from '../_domain/task-domain.service';
import { TareaModel } from '../_models/Taks.model';

@Injectable({
    providedIn: 'root',
})
export class TasksService extends TableService<TareaModel> implements OnDestroy{
    
    constructor(
        @Inject(HttpClient) http,
        private _taskservicedomain: TaskHTTPServiceDomain
    ) {
        super(http);
    }

    find(tableState: ITableState): Observable<TableResponseModel<TareaModel>> {
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let title = tableState.searchTerm;
        let user = tableState.searchAux1;
    
        return this._taskservicedomain.getTasks(page , size, title, user).pipe(
        map(
        response => {
            let result: TableResponseModel<TareaModel> = {
                items: response.data.content,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            
            return result;
        }
        ));
    }

    getAllTasks(): Observable<PagedResponse<TareaModel>> {
        return this._taskservicedomain.getAllTasks().pipe(
            map(
            response => {
              //  console.log(response);
                return response.data;
            }
        ));    
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
      }
}