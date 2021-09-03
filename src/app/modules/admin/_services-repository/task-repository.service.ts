import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { TareaModel } from '../_models/Tarea.model';
import { TaskHTTPServiceDomain } from '../_services/task-domain.service';

@Injectable({
    providedIn: 'root',
})
export class TaskRepositoryService {
    public _items$ = new BehaviorSubject<TareaModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    //private _subscriptions: Subscription[] = [];
     // Getters
     get items$() {
        return this._items$.asObservable();
      }
      get isLoading$() {
        return this._isLoading$.asObservable();
      }


    constructor(
        private _taskservicedomain: TaskHTTPServiceDomain
    ) {}

    getAllTasks(): Observable<PagedResponse<TareaModel>> {
        return this._taskservicedomain.getAllTasks().pipe(
            map(
            response => {
              //  console.log(response);
                return response.data;
            }
        ));    
    }
}