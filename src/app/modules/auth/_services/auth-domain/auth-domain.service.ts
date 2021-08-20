import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthHTTPServiceURL } from '../auth-http/auth-http.service';
import { UserModel } from '../../../auth/_models/user.model';
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

        const user = new UserModel();
        user.id = result.body.data.id;
        user.roleCode = result.body.data.roleCode;
        user.roleDescription = result.body.data.roleDescription;
        user.typeDocumentCode = result.body.data.typeDocumentCode;
        user.typeDocumentDescription = result.body.data.typeDocumentDescription;
        user.districtCode=result.body.data.districtCode;
        user.populatedCenterCode = result.body.data.populatedCenterCode;
        user.documentNumber = result.body.data.documentNumber;
        user.name = result.body.data.name;
        user.secondName = result.body.data.secondName;
        user.lastName = result.body.data.lastName;
        user.secondLastName = result.body.data.secondName;
        user.phone1=result.body.data.phone1;
        user.phone2=result.body.data.phone2;
        user.referentialAddress=result.body.data.referentialAddress;
        user.latitude=result.body.data.latitude;
        user.longitude=result.body.data.longitude;
        user.frontDocument=result.body.data.frontDocument;
        user.reverseDocument=result.body.data.reverseDocument;
        sessionStorage.setItem("user", JSON.stringify(user));
         console.log(user);

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
