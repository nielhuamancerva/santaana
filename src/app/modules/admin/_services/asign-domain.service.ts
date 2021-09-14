import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { AuthService } from '../../auth/_services/auth.service';
import { UserModel } from '../_models/user.model';
import { PagedResponse } from 'src/app/_commons/_models/PagedResponse';
import { BuildHeaderService } from 'src/app/_commons/_services/Header-Builder.service';
import { DepartamentModel } from '../_models/Departament.model';
import { UserAsingModel } from '../_models/UserAsign.model';

@Injectable({
    providedIn: 'root',
})
export class UserAsignHTTPServiceDomain {
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _errorMessage = new BehaviorSubject<string>('');

    public _itemsUbigee$ = new BehaviorSubject<DepartamentModel[]>([]);
    public _itemsAsignUbigee$ = new BehaviorSubject<DepartamentModel[]>([]);
    private _subscriptions: Subscription[] = [];

    get itemsUbigee$() {
        return this._itemsUbigee$.asObservable();
    }
    get isLoading$() {
        return this._isLoading$.asObservable();
    }

    API_URL_Local = `${environment.apiUrl}/user/ubigee/`;
    constructor(private http: HttpClient,
    private buildheader:BuildHeaderService,
    private auth: AuthService) { }

    getAllUserAsign(): Observable<ApiResponse<any>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<any>>(this.API_URL_Local,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    postAsingUser(InputDni,body): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = this.buildheader.buildHeader();
        this.http.post(this.API_URL_Local+ `${InputDni}`,body,{headers: header})
        .subscribe(
            data => {
                console.log(data);
            }
          );

        return this.http.post<ApiResponse<PagedResponse<UserModel>>>(this.API_URL_Local+ `${InputDni}`,body,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    postEditAsingUser(InputDni,body): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = this.buildheader.buildHeader();
        this.http.patch( this.API_URL_Local + `${InputDni}`, body, { headers: header })
        .subscribe(
            data => {
                console.log(data);
            }
          );

        return this.http.patch<ApiResponse<PagedResponse<UserModel>>>(this.API_URL_Local + `${InputDni}`,body,{
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

    getItemById(id): Observable<ApiResponse<UserAsingModel<DepartamentModel>>> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const header = this.buildheader.buildHeader();
        const url = this.API_URL_Local + `${id}`;
        return this.http.get<any>(url,{
            headers: header 
        }).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('GET ITEM BY IT', id, err);
                return of({ id: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    getAllAsignInternalUser(): Observable<ApiResponse<UserAsingModel<DepartamentModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<UserAsingModel<DepartamentModel>>>(this.API_URL_Local,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    fetch() {
        this._isLoading$.next(true);
        const id= '';
        const request = this.getAllAsignInternalUser()
        .pipe(
            tap((response) => {
                console.log(response)
                this._itemsUbigee$.next(response.data.data);
            }),
            finalize(() => {
                this._isLoading$.next(false);
            })
        )
        .subscribe();
        this._subscriptions.push(request);
    }
}