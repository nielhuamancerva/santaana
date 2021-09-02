import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { TareaModel } from '../_models/Tarea.interface';
import { PagedResponse } from '../../../_commons/_models/PagedResponse';
import { BuildHeaderService } from '../../../_commons/_services/Header-Builder.service';
import { AuthModel } from '../../auth/_models/auth.model';
import { AuthService } from '../../auth/_services/auth.service';

@Injectable({
    providedIn: 'root',
})

export class TaskHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/tasks`;
    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService,
        private auth: AuthService
    ){ }

    CreateTask(task: any): Observable<TareaModel> {
        console.log(task)
        const fileJson = JSON.stringify(task);

        const header = this.buildHeader();
        this.http.post(this.API_URL, fileJson,{headers: header})
            .subscribe(
                data => {
                    console.log(data);
                }
            );
            return this.http.post<TareaModel>(this.API_URL, fileJson,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllTasks(): Observable<ApiResponse<PagedResponse<TareaModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<TareaModel>>>(this.API_URL,{
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

    buildHeader(): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders()
            .set("Authorization", "Bearer " + this.getAuthFromLocalStorage() )
            .set("payload", "company" )
            .set("Access-Control-Allow-Origin", "*")

        return headers;
    }

    getAuthFromLocalStorage(): AuthModel {
        try {
            const authData = JSON.parse(localStorage.getItem(this.auth.authLocalStorageToken));
            return authData.authToken;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}