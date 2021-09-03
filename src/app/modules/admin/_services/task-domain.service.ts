import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { TareaModel } from '../_models/Tarea.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { TaskModule } from '../task/task.module';

@Injectable({
    providedIn: 'root',
})

export class TaskHTTPServiceDomain {

    public _items$ = new BehaviorSubject<TareaModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _subscriptions: Subscription[] = [];
    API_URL = `${environment.apiUrlNiel}/tasks`;
    API_URL_Local = `http://localhost:8880/api/tasks`;

     // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }

    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ){ }

    CreateTask(body): Observable<TareaModel> {
        const header = this.buildheader.buildHeaderPost();
        const request = this.http.post<TareaModel>(this.API_URL_Local, body,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
            this._subscriptions.push(request);

            return this.http.post<TareaModel>(this.API_URL_Local, body,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    UpdateTask(body): Observable<TareaModel> {
        const header = this.buildheader.buildHeaderPost();
        const request = this.http.patch(this.API_URL_Local, body,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
        this._subscriptions.push(request);

            return this.http.patch<TareaModel>(this.API_URL_Local, body,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllTasks(): Observable<ApiResponse<PagedResponse<TareaModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<TareaModel>>>(this.API_URL_Local+`?code=753a9458-2e42-4877-9f99-ce79b9dce992`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let errorMessage = "";
        if (err.error instanceof ErrorEvent) {
            errorMessage = `Un error ha ocurrido: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);

        return throwError(errorMessage);
    }

     fetch() {
      //  this._isLoading$.next(true);
      //  this._errorMessage.next('');
      this._isLoading$.next(true);

      const request = this.getAllTasks()
      .pipe(
        tap((response) => {
        this._items$.next(response.data.content);
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);


    //   return this.getAllTasks().pipe(
    //     map(
    //     response => {this._items$.next(response.data.content);
    //         console.log(response);
    //         return response.data;
    //     }
    // ),finalize(() => {
    //     this._isLoading$.next(false);
    //   }) );    


      }
}