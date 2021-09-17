import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { TareaModel } from '../_models/Taks.model';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';
import { retrieveStringFromStorage } from 'src/app/_commons/utils/storage';

@Injectable({
    providedIn: 'root',
})

export class TaskHTTPServiceDomain {

    public _items$ = new BehaviorSubject<TareaModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _subscriptions: Subscription[] = [];
    API_URL_Local = `http://localhost:8880/api/tasks`;
    API_URL = `${environment.apiService}/tasks`;
    header = buildHeader();

     // Getters
    get items$() {
        return this._items$.asObservable();
    }
    get isLoading$() {
        return this._isLoading$.asObservable();
    }

    constructor(
        private _http: HttpClient
    ){ }

    CreateTask(body): Observable<TareaModel> {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
            .set("Access-Control-Allow-Origin", "*");

            return this._http.post<TareaModel>(this.API_URL_Local, body,{
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    UpdateTask(body): Observable<TareaModel> {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
            .set("Access-Control-Allow-Origin", "*");

            return this._http.patch<TareaModel>(this.API_URL_Local, body,{
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllTasks(): Observable<ApiResponse<PagedResponse<TareaModel>>> {
        const header = buildHeader();
        return this._http.get<ApiResponse<PagedResponse<TareaModel>>>(this.API_URL_Local,{
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
            console.log(response);
        this._items$.next(response.data.content);
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
        this._subscriptions.push(request);

    }

    getTasks(page: number , size: number, title: string, user: string): Observable<ApiResponse<PagedResponse<TareaModel>>> {
        const header = buildHeader();

        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (title) {
            params = params.set("title", title);
        } 
        
        if (user) {
            params = params.set("user", user);
        }

        return this._http.get<ApiResponse<PagedResponse<TareaModel>>>( this.API_URL,{
            headers: header,
            params: params
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }
}