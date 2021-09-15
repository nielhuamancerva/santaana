import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';
import { PaymentHeaderModel } from '../_models/payment.header.model';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';
import { PagedResponse } from 'src/app/_commons/_models/paged-response.model';
import { retrieveStringFromStorage } from 'src/app/_commons/utils/storage';
import { BoxSquareModel } from '../_models/boxsquare.model';

@Injectable({
    providedIn: 'root',
})

export class BoxSquareDomainService {
    API_URL = `${environment.apiService}/boxsquare`;

    constructor(private _http: HttpClient) { }

    getBoxSquareList(page: number , size: number, agent: string, state: number,dateIn: string, dateFn: string): Observable<ApiResponse<PagedResponse<BoxSquareModel>>> {
        const header = buildHeader();

        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (agent) {
            params = params.set("agent", agent);
        }

        if (state) {
            params = params.set("state", state.toString());
        } 
        
        if (dateIn) {
            params = params.set("dateIn", dateIn);
        } 

        if (dateFn) {
            params = params.set("dateFn", dateFn);
        } 

        return this._http.get<ApiResponse<PagedResponse<BoxSquareModel>>>( `${this.API_URL}s`, {
            headers: header,
            params: params
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getBoxSquareListMe(page: number , size: number, state: number, dateIn: string, dateFn: string): Observable<ApiResponse<PagedResponse<BoxSquareModel>>> {
        const header = buildHeader();

        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (state) {
            params = params.set("state", state.toString());
        } 
        
        if (dateIn) {
            params = params.set("dateIn", dateIn);
        } 

        if (dateFn) {
            params = params.set("dateFn", dateFn);
        } 

        return this._http.get<ApiResponse<PagedResponse<BoxSquareModel>>>( `${this.API_URL}s/me`, {
            headers: header,
            params: params
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }


    createBoxSquare(data: FormData): Observable<ApiResponse<BoxSquareModel>> {
        let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
        .set("Access-Control-Allow-Origin", "*");
 
        return this._http.post<ApiResponse<BoxSquareModel>>(this.API_URL, data,{
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    updateBoxSquare(id: string, data: BoxSquareModel): Observable<ApiResponse<BoxSquareModel>> {
        const header = buildHeader();

        return this._http.patch<ApiResponse<BoxSquareModel>>(`${this.API_URL}/${id}`, data,{
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

}