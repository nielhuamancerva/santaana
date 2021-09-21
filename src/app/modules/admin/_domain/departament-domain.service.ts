import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { PagedResponse } from '../../../_commons/_models/paged-response.model';
import { DepartamentModel } from '../_models/Departament.model';

import { ApiRespuesta, Data, Content } from '../_models/Prueba.interface';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';

@Injectable({
    providedIn: 'root',
})

export class DepartamentDomainService {
    API_URL = `${environment.apiService}/ubigee/department`;
  
    header = buildHeader();
    responseApi: ApiRespuesta;
    data: Data;
    _departaments: Content[] = [];
    _departamentByCode: Content[] = [];

    get departaments(){
        return [...this._departaments];
    }
    
    get departametByCode(){
        return this._departamentByCode;
    }

    constructor(private http: HttpClient) { }

    getAllDepartament(): Observable<ApiResponse<PagedResponse<DepartamentModel>>> {
        const header = buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DepartamentModel>>>(this.API_URL,{
            headers: header
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getByDepartament(code): Observable<ApiResponse<PagedResponse<DepartamentModel>>> {
        const header = buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DepartamentModel>>>(`${environment.apiService}/ubigee/department?code=${code}`,{
            headers: header
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }
    
    getAll(){
        return this.http.get<ApiRespuesta>(this.API_URL,{
            headers: this.header
        }).subscribe( (resp) => {
            this._departaments = resp.data.content;
        })
    }

    getAll2(){
        return this.http.get<ApiRespuesta>(this.API_URL,{
            headers: this.header
        }).pipe(map(
            response => {
                return response.data;
            }
        ));
    }


    getById(code){
        return this.http.get<ApiRespuesta>(this.API_URL + `?code=${code}`,{
            headers: this.header
        }).pipe(map(
            response => {
                return response.data;
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