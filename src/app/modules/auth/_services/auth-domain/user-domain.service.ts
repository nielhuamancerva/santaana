import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../../src/environments/environment';
import { ApiResponse } from '../../_models/ApiResponse.model';
import { AuthModel } from '../../_models/auth.model';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { TypePersonModel } from '../../_models/TypePerson.model';
import { UserModel } from '../../_models/user.model';
import { couldStartTrivia } from 'typescript';

@Injectable({
    providedIn: 'root',
})
export class UserHTTPServiceDomain {
    API_URL = `${environment.apiUrlNiel}/user`;
    API_URL1 = `${environment.apiUrlNiel}/users`;
  constructor(private http: HttpClient,
    private auth: AuthService) { }

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
        const header = this.buildHeader();
        this.http.post(this.API_URL, formData,{headers: header})
        .subscribe(
            data => {
                console.log(data);
            }
          );
        return this.http.post<UserModel>(this.API_URL, formData,{
            headers: header 
        })
            .pipe(map(response => response))
            .pipe(catchError(this.handleError));
    }

    getAllUser(): Observable<ApiResponse<any>> {
        const header = this.buildHeader();
        return this.http.get<ApiResponse<any[]>>(this.API_URL1,{
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
        //.set("Connection", retrieveStringFromStorage("ConnectionCompany") ) 99dedcc7-ffbc-41e0-8494-73cfae25dffe
        .set("payload", "company" )
        .set("Company", "ac3e02e6-69b2-4e36-bda6-de98673fc74b" )
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

    setuser(result){
        const user = new UserModel();
        user.roleCode =result.roleCode;//set
        user.roleDescription = "Administrador";
        user.typeDocumentCode = result.typeDocumentCode;//set
        user.typeDocumentDescription = null;
        user.districtCode='NODATA';
        user.populatedCenterCode = 'NODATA';
        user.documentNumber = result.documentNumber;//set
        user.name = result.name;//set
        user.secondName = result.secondName;//set
        user.lastName = result.lastName;//set
        user.secondLastName = result.secondLastName;//set
        user.typePersonCode= result.typePersonCode;//set
        user.email= result.email;//set
        user.userName= result.userName;//set
        user.phone1=result.phone1;//set
        user.phone2=null;
        user.referentialAddress=null;
        user.latitude=null;
        user.longitude=null;
        user.frontDocument=null;
        user.reverseDocument=null;
        user.enable=true;
        return user;
    }
}