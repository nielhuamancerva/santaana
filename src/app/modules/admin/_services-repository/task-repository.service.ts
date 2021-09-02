import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { TareaModel } from '../_models/Tarea.interface';
import { TaskHTTPServiceDomain } from '../_services/task-domain.service';

@Injectable({
    providedIn: 'root',
})
export class TaskRepositoryService {

    constructor(
        private _taskservicedomain: TaskHTTPServiceDomain
    ) {}

    getAllSales(): Observable<PagedResponse<TareaModel>> {
        return this._taskservicedomain.getAllTasks().pipe(
            map(
            response => {
                return response.data;
            }
        ));    
    }
}