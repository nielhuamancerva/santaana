import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { DepartamentModel } from '../_models/Departament.model';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { ApiRespuesta, Data, Content } from '../_models/Prueba.interface';

@Injectable({
    providedIn: 'root',
})

export class DepartamentHTTPServiceDomain {
    public _items$ = new BehaviorSubject<DepartamentModel[]>([]);
    private _subscriptions: Subscription[] = [];
    API_URL_Local = `${environment.apiUrl}/ubigee/department`;
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    header = this.buildheader.buildHeader();
    responseApi: ApiRespuesta;
    data: Data;
    private _departaments: Content[] = [];
    private _depsRoyer: DepartamentModel[] = [];
    _departamentByCode: Content[] = [];

    get departaments(){
        return [...this._departaments];
    }

    get depsRoyer(){
        return [...this._depsRoyer];
    }

    get isLoading$() {
        return this._isLoading$.asObservable();
    }
    
    get departametByCode(){
        return this._departamentByCode;
    }

    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllDepartament(): Observable<ApiResponse<PagedResponse<DepartamentModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DepartamentModel>>>(this.API_URL_Local,{
            headers: header
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getByDepartament(code): Observable<ApiResponse<PagedResponse<DepartamentModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DepartamentModel>>>(this.API_URL_Local + `?code=${code}`,{
            headers: header
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }
    
    getAll(): Observable<DepartamentModel[]>{
        return this.http.get<ApiRespuesta>(this.API_URL_Local,{
            headers: this.header
        }).pipe(map(response => 
            response.data.content
        ))
        .pipe(catchError(this.handleError));
    }

    getAll2(){
        return this.http.get<ApiRespuesta>(this.API_URL_Local,{
            headers: this.header
        }).pipe(map(
            response => {
                return response.data;
            }
        ));
    }

    getById(code){
        return this.http.get<any>(this.API_URL_Local + `?code=${code}`,{
            headers: this.header
        }).pipe(map(
            response => {
                return response.data.content;
            }
        ));
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
}