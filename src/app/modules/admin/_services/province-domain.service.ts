import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { ProvinceModel } from '../_models/Province.model';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { ApiRespuesta, Data, Content } from '../_models/Prueba.interface';

@Injectable({
    providedIn: 'root',
})

export class ProvinceHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/ubigee/province?code=13`;
    API_URL1 = `${environment.apiUrlNiel}/ubigee/province`;
    header = this.buildheader.buildHeader();
    responseApi: ApiRespuesta;
    data: Data;
    private _provinces: Content[] = [];
    private _provincesByDepartament: Content[] = [];

    get provinces(){
        return [...this._provinces];
    }

    get provincesByDepartament(){
        return [...this._provincesByDepartament];
    }

    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService
    ) { }

    getAllProvince(code): Observable<ApiResponse<PagedResponse<ProvinceModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<ProvinceModel>>>(`${environment.apiUrlNiel}/ubigee/province?code=${code}`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAll(){
        return this.http.get<ApiRespuesta>(this.API_URL,{
            headers: this.header
        }).subscribe( (resp) => {
            this._provinces = resp.data.content;
        })
    }

    getByProvince(code): Observable<ApiResponse<PagedResponse<ProvinceModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<ProvinceModel>>>(`${environment.apiUrlNiel}/ubigee/province?code=${code}`,{
            headers: header
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
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

    getAllProvincesByDepartament(departamentCode): Observable<any>{
        console.log(departamentCode)
        const header = this.buildheader.buildHeader();
        return this.http.get<any>(`${environment.apiUrlNiel}/ubigee/province?code=13`,{
            headers: header
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }
}