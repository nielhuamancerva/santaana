import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';
import { NotaModel } from '../_models/Nota.interface';
import { retrieveStringFromStorage } from 'src/app/_commons/utils/storage';

@Injectable({
    providedIn: 'root',
})

export class NoteHTTPServiceDomain {
    public _items$ = new BehaviorSubject<NotaModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _subscriptions: Subscription[] = [];
    API_URL_Local = `http://localhost:8880/api/notes`;
    header = buildHeader();

    get items$() {
        return this._items$.asObservable();
    }
    get isLoading$() {
        return this._isLoading$.asObservable();
    }

    constructor(
        private http: HttpClient
    ){ }

    CreateNote(body): Observable<NotaModel> {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
            .set("Access-Control-Allow-Origin", "*");
        const request = this.http.post(this.API_URL_Local, body,{headers: headers})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
        this._subscriptions.push(request);
        return this.http.post<NotaModel>(this.API_URL_Local, body,{
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    UpdateNote(body): Observable<NotaModel> {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
            .set("Access-Control-Allow-Origin", "*");
        const request = this.http.patch(this.API_URL_Local, body,{headers: headers})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
        this._subscriptions.push(request);
            return this.http.patch<NotaModel>(this.API_URL_Local, body,{
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllNotes(): Observable<ApiResponse<PagedResponse<NotaModel>>> {
        const header = buildHeader();
        return this.http.get<ApiResponse<PagedResponse<NotaModel>>>(this.API_URL_Local+`/user`,{
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
        this._isLoading$.next(true);
        const request = this.getAllNotes()
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
    }
}