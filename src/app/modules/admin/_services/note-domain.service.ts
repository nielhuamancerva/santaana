import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { NotaModel } from '../_models/Nota.interface';

@Injectable({
    providedIn: 'root',
})

export class NoteHTTPServiceDomain {
    public _items$ = new BehaviorSubject<NotaModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _subscriptions: Subscription[] = [];
    API_URL = `${environment.apiUrlNiel}/notes`;
    API_URL_Local = `http://localhost:8880/api/notes`;

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

    CreateNote(body): Observable<NotaModel> {
        const header = this.buildheader.buildHeaderPost();
        const request = this.http.post(this.API_URL_Local, body,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
        this._subscriptions.push(request);
        return this.http.post<NotaModel>(this.API_URL_Local, body,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    UpdateNote(body): Observable<NotaModel> {
        const header = this.buildheader.buildHeaderPost();
        const request = this.http.patch(this.API_URL_Local, body,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
        this._subscriptions.push(request);
            return this.http.patch<NotaModel>(this.API_URL_Local, body,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllNotes(): Observable<ApiResponse<PagedResponse<NotaModel>>> {
        const header = this.buildheader.buildHeader();
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