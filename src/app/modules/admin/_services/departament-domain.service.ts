import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
    API_URL = `${environment.apiUrlNiel}/ubigee/department`;
    header = this.buildheader.buildHeader();
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

    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllDepartament(): Observable<ApiResponse<PagedResponse<DepartamentModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DepartamentModel>>>(this.API_URL,{
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

    getById(code){
        return this.http.get<ApiRespuesta>(this.API_URL + `?code=${code}`,{
            headers: this.header
        }).pipe(map(
            response => {
                console.log("hola");
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