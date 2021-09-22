import { LocalDomainService } from './local-domain.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/api-response.model';
import { UserModel } from '../_models/user.model';
import { PagedResponse } from 'src/app/_commons/_models/paged-response.model';
import { buildHeader } from 'src/app/_commons/_helpers/http-header';
import { retrieveStringFromStorage } from 'src/app/_commons/utils/storage';

@Injectable({
    providedIn: 'root',
})
export class UserDomainService {

   API_URL = `${environment.apiService}/users`;
   API_URL_UBIGEO = `${environment.apiService}/users/ubigee`;
   file: Blob;

  constructor(private _http: HttpClient,
                private _filePath: LocalDomainService) { }

    createUser(data: FormData, hasher: string): Observable<ApiResponse<UserModel>> {
   
        let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
        .set("Access-Control-Allow-Origin", "*")
        .set("payload", hasher);



        return this._http.post<ApiResponse<UserModel>>(this.API_URL, data, {
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }


    updateUser(data: FormData, userId: string): Observable<ApiResponse<UserModel>> {
   
        let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
        .set("Access-Control-Allow-Origin", "*")


        return this._http.patch<ApiResponse<UserModel>>(`${this.API_URL}/${userId}` , data, {
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }


    getInternalUsers(page: number , size: number, docnum: string, name: string, state: string, type: string): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = buildHeader();

        var params = new HttpParams();

        params = params.set("page",page.toString());
        params = params.set("size",size.toString());

        if (type) {
            params = params.set("type", type);
        }

        if (docnum) {
            params = params.set("docnum", docnum);
        } 
        
        if (name) {
            params = params.set("name", name);
        } 

        if (state) {
            params = params.set("state", state);
        } 

        return this._http.get<ApiResponse<PagedResponse<UserModel>>>( `${this.API_URL}`,{
            headers: header,
            params: params
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getByDocumentUser(InputSearchDni): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = buildHeader();
        return this._http.get<ApiResponse<PagedResponse<UserModel>>>(this.API_URL+ `?docnum=${InputSearchDni}`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getByUbigeo(InputSearchDni): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = buildHeader();
        return this._http.get<ApiResponse<PagedResponse<UserModel>>>(this.API_URL_UBIGEO+ `?docnum=${InputSearchDni}`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }


    changeHasherRoot(id: string, hasher: string, _user: UserModel): Observable<ApiResponse<UserModel>> {
        let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
        .set("Access-Control-Allow-Origin", "*");

        headers = headers.set("npayload", hasher);

        return this._http.patch<ApiResponse<UserModel>>(`${environment.apiService}/admin/user/changehasher/${id}`, _user, {
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    enableDisabled(id: string, _user: UserModel): Observable<ApiResponse<UserModel>> {
        let headers: HttpHeaders = new HttpHeaders()
        .set("Authorization", "Bearer " + retrieveStringFromStorage("TokenAuthorization") )
        .set("Access-Control-Allow-Origin", "*");

        return this._http.patch<ApiResponse<UserModel>>(`${environment.apiService}/user/enabled/${id}`, _user, {
            headers: headers 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    postAsingUser(InputDni,body): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = buildHeader();
        this._http.post(this.API_URL+ `/ubigee/${InputDni}`,body,{headers: header})
        .subscribe(
            data => {
                console.log(data);
            }
          );

        return this._http.post<ApiResponse<PagedResponse<UserModel>>>(this.API_URL+ `/ubigee/${InputDni}`,body,{
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

    /*setuser(result){
        let user:UserModel={
        roleCode:result.roleCode,//set
        roleDescription : "Administrador",
        typeDocumentCode : result.typeDocumentCode,//set
        typeDocumentDescription : null,
        districtCode:'NODATA',
        populatedCenterCode : 'NODATA',
        documentNumber : result.documentNumber,//set
        name : result.name,//set
        secondName : result.secondName,//set
        lastName : result.lastName,//set
        secondLastName : result.secondLastName,//set
        typePersonCode: result.typePersonCode,//set
        typePersonDescription:null,
        email: result.email,//set
        userName: result.userName,//set
        phone1:result.phone1,//set
        phone2:null,
        referentialAddress:null,
        latitude:null,
        longitude:null,
        frontDocument:null,
        reverseDocument:null,
        lastPage:null,
        evidence:null, 
        enabled:'1',
        };
        return user;
    }*/
}