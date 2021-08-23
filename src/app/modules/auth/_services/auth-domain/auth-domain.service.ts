import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthHTTPServiceURL } from '../auth-http/auth-http.service';
import { UserModel } from '../../../admin/_models/user.model';
import { AuthModel } from '../../../auth/_models/auth.model';
import { environment } from '../../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPServiceDomain {
  constructor(private http: HttpClient,
    private authHttpServiceURL: AuthHTTPServiceURL,) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }
    return this.authHttpServiceURL.loginToken(email, password).pipe(
      map((result:  any) => {
        console.log(result);
        if (!result) {
          return notFoundError;
        }

        let user:UserModel={
          roleCode:result.body.data.roleCode,//set
          roleDescription : result.body.data.roleDescription,
          typeDocumentCode : result.body.data.typeDocumentCode,//set
          typeDocumentDescription : result.body.data.typeDocumentDescription,
          districtCode:result.body.data.districtCode,
          populatedCenterCode :result.body.data.populatedCenterCode,
          documentNumber : result.body.data.documentNumber,//set
          name : result.body.data.name,//set
          secondName : result.body.data.secondName,//set
          lastName : result.body.data.lastName,//set
          secondLastName : result.body.data.secondName,//set
          typePersonCode: result.body.data.typePersonCode,//set
          typePersonDescription:result.body.data.typePersonCode,
          email: result.body.data.email,//set
          userName: result.userName,//set
          phone1:result.body.data.phone1,//set
          phone2:result.body.data.phone2,
          referentialAddress:result.body.data.referentialAddress,
          latitude:result.body.data.latitude,
          longitude:result.body.data.longitude,
          frontDocument:result.body.data.frontDocument,
          reverseDocument:result.body.data.reverseDocument,
          lastPage:result.body.data.lastPage,
          evidence:result.body.data.evidence, 
          enable:result.body.data.enable,
          };


        sessionStorage.setItem("user", JSON.stringify(user));

        const auth = new AuthModel();
        auth.authToken = result.headers.get('BearerAuthorization');
        auth.refreshToken = result.headers.get('RefreshAuthorization');
        auth.expiresIn = result.headers.get('ExpirationAuthorization');
       // console.log(auth.authToken);
        return auth;

      })
    );
  }

  getUserByToken(token): Observable<any> {
    let item = JSON.parse(sessionStorage.getItem('user'));
      
    return of(item);

  }

}
