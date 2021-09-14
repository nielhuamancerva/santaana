import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../_commons/_models/ApiResponse.model';
import { AuthModel } from '../../auth/_models/auth.model';
import { AuthService } from '../../auth/_services/auth.service';
import { TypePersonModel } from '../_models/TypePerson.model';
import { UserModel } from '../_models/user.model';
import { couldStartTrivia } from 'typescript';
import { PagedResponse } from 'src/app/_commons/_models/PagedResponse';
import { BuildHeaderService } from 'src/app/_commons/_services/Header-Builder.service';
import { DepartamentModel } from '../_models/Departament.model';

@Injectable({
    providedIn: 'root',
})
export class UserHTTPServiceDomain {
    public _itemsUbigee$ = new BehaviorSubject<DepartamentModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _subscriptions: Subscription[] = [];
    API_URL1 = `${environment.apiUrl}/users`;
    API_URL_Local = `${environment.apiUrl}/user`;

    get itemsUbigee$() {
        return this._itemsUbigee$.asObservable();
    }
    get isLoading$() {
        return this._isLoading$.asObservable();
    }

    constructor(
        private http: HttpClient,
        private buildheader:BuildHeaderService,
        private auth: AuthService
    ) { }

    CreateUser($user: UserModel): Observable<UserModel> {
        console.log($user);
        const fileJson = new File([JSON.stringify(this.setuser($user))], "file2.json", {type: "application/json"});
        const f1 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        const f2 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        const f3 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        const f4 = new File(['./assets/media/users/default.jpg'], "file.jpg", {type: "application/jpg"});
        
        const formData: FormData = new FormData();
        formData.append('user', fileJson);
        formData.append('frontDocument', f1, 'name1');
        formData.append('reverseDocument', f2, 'name1');
        formData.append('lastPage', f3, 'name1');
        formData.append('evidence', f4, 'name1');
        const header = this.buildheader.buildHeaderPost();
        this.http.post(this.API_URL_Local, formData,{headers: header})
        .subscribe(
            data => {
                console.log(data);
            }
          );
        return this.http.post<UserModel>(this.API_URL_Local, formData,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllUser(): Observable<ApiResponse<any>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<any[]>>(this.API_URL1,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getByDocumentUser(InputSearchDni): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<UserModel>>>(this.API_URL_Local+ `?documentNumber=${InputSearchDni}`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    postAsingUser(InputDni,body): Observable<ApiResponse<PagedResponse<UserModel>>> {
        const header = this.buildheader.buildHeader();
        this.http.post(this.API_URL_Local+ `/ubigee/${InputDni}`,body,{headers: header})
        .subscribe(
            data => {
                console.log(data);
            }
          );

        return this.http.post<ApiResponse<PagedResponse<UserModel>>>(this.API_URL_Local+ `/ubigee/${InputDni}`,body,{
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
    
    setuser(result){
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
        enable:true,
        };
        return user;
    }

    getAllAsignInternalUser(): Observable<ApiResponse<PagedResponse<DepartamentModel>>> {
        console.log("me ejecuté aquí")
        const header = this.buildheader.buildHeader();
        return this.http.get<ApiResponse<PagedResponse<DepartamentModel>>>(this.API_URL_Local + `/ubigee/753a9458-2e42-4877-9f99-ce79b9dce992`,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    fetch() {
        this._isLoading$.next(true);
        const request = this.getAllAsignInternalUser()
        .pipe(
            tap((response) => {
                this._itemsUbigee$.next(response.data.content);
                console.log(response)
            }),
            finalize(() => {
                this._isLoading$.next(false);
            })
        )
        .subscribe();
        this._subscriptions.push(request);
    }
}