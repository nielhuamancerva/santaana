import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserHTTPServiceDomain } from '../auth-domain/user-domain.service';
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
}