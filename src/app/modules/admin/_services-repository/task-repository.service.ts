import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { TareaModel } from '../_models/Tarea.model';
import { TaskHTTPServiceDomain } from '../_services/task-domain.service';

@Injectable({
    providedIn: 'root',
})
export class TaskRepositoryService {

    constructor(
        private _taskservicedomain: TaskHTTPServiceDomain
    ) {}

    getAllTasks(): Observable<PagedResponse<TareaModel>> {
        return this._taskservicedomain.getAllTasks().pipe(
            map(
            response => {
                console.log(response);
                return response.data;
            }
        ));    
    }
}