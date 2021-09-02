import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PagedResponse } from 'src/app/_commons/_models/PagedResponse';
import { UserModel } from '../_models/user.model';
import { UserHTTPServiceDomain } from '../_services/user-domain.service';
@Injectable({
  providedIn: 'root',
})
export class UserRepositoryService {

    constructor(
        private _userservicedomain: UserHTTPServiceDomain
    ) {}

    getAllUser(): Observable<any> {
        return this._userservicedomain.getAllUser().pipe(
            map(
            response => {
                console.log(response);
                return response;
            }
        ));    
    }
    getByDocumentUser(InputSearchDni): Observable<PagedResponse<UserModel>> {
        return this._userservicedomain.getByDocumentUser(InputSearchDni).pipe(
            map(
            response => {
                console.log(response);
                return response.data;
            }
        ));    
    }
}