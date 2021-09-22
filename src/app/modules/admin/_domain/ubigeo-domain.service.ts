import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/_services/auth.service';
import { UserModel } from '../_models/user.model';
import { DepartamentModel } from '../_models/Departament.model';
import { UserAsingModel } from '../_models/UserAsign.model';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';
import { retrieveStringFromStorage } from 'src/app/_commons/utils/storage';

@Injectable({
    providedIn: 'root',
})
export class UbigeoHTTPServiceDomain {
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _errorMessage = new BehaviorSubject<string>('');

    public _itemsUbigee$ = new BehaviorSubject<DepartamentModel[]>([]);
    public _itemsAsignUbigee$ = new BehaviorSubject<DepartamentModel[]>([]);
    private _subscriptions: Subscription[] = [];
    header = buildHeader();

    get itemsUbigee$() {
        return this._itemsUbigee$.asObservable();
    }
    get isLoading$() {
        return this._isLoading$.asObservable();
    }

    API_URL = `${environment.apiService}/user/ubigee/`;
    constructor(
        private _http: HttpClient
    ){ }

    getAllUserAsign(): Observable<ApiResponse<any>> {
        const header = buildHeader();
        return this._http.get<ApiResponse<any>>(this.API_URL,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    postAsingUser(InputDni,body): Observable<ApiResponse<PagedResponse<UserModel>>> {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
            .set("Access-Control-Allow-Origin", "*");
        this._http.post(this.API_URL+ `${InputDni}`,body,{headers: headers})
        .subscribe(
            data => {
                console.log(data);
            }
          );

        return this._http.post<ApiResponse<PagedResponse<UserModel>>>(this.API_URL+ `${InputDni}`,body,{
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    postEditAsingUser(InputDni,body): Observable<ApiResponse<PagedResponse<UserModel>>> {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
            .set("Access-Control-Allow-Origin", "*");
        this._http.patch( this.API_URL + `${InputDni}`, body, { headers: headers })
        .subscribe(
            data => {
                console.log(data);
            }
          );

        return this._http.patch<ApiResponse<PagedResponse<UserModel>>>(this.API_URL + `${InputDni}`,body,{
            headers: headers 
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

    getItemById(id): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const header = buildHeader();
        const url = this.API_URL + `${id}`;
        return this._http.get<any>(url,{
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

    getAllAsignInternalUser(): Observable<ApiResponse<PagedResponse<UserAsingModel<DepartamentModel>>>> {
        const header = buildHeader();
        return this._http.get<ApiResponse<PagedResponse<UserAsingModel<DepartamentModel>>>>(this.API_URL,{
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
                // this._itemsUbigee$.next(response.data);
            }),
            finalize(() => {
                this._isLoading$.next(false);
            })
        )
        .subscribe();
        this._subscriptions.push(request);
    }

    getUbigeos(page: number , size: number, user: string): Observable<ApiResponse<PagedResponse<UserAsingModel<DepartamentModel>>>> {
        const header = buildHeader();

        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());
        console.log("ejecutando")
        
        if (user) {
            params = params.set("username", user);
        }
        console.log(params)


        const request = this._http.get<any>(this.API_URL,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );

        return this._http.get<ApiResponse<PagedResponse<UserAsingModel<DepartamentModel>>>>( this.API_URL,{
            headers: header,
            params: params
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }
}