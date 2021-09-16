import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { TaskHTTPServiceDomain } from '../_domain/task-domain.service';
import { TareaModel } from '../_models/Taks.model';

@Injectable({
    providedIn: 'root',
})
export class TaskRepositoryService {
    public _items$ = new BehaviorSubject<TareaModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _subscriptions: Subscription[] = [];
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

    AllTaks() {
      //  this._isLoading$.next(true);
      //  this._errorMessage.next('');
      this._isLoading$.next(true);

      const request = this.getAllTasks()
      .pipe(
        tap((response) => {
        this._items$.next(response.content);
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
      }
}