import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../../admin/_models/user.model';
import { AuthModel } from '../_models/auth.model';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { retrieveStringFromStorage } from 'src/app/_commons/utils/storage';
import { AuthHTTPRepositoryService } from '../_domain/auth-http-repository.service';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  get getAuthorizationToken(): String {
    return retrieveStringFromStorage("TokenAuthorization");
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private _authHttpService: AuthHTTPRepositoryService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string):  Observable<ApiResponse<UserModel>> {
    this.isLoadingSubject.next(true);
    return this._authHttpService.login({usernameOrEmail: email, password: password}).pipe(
      map( response => {
        if (response.success) {
          const result = this.setAuthFromLocalStorage({
            authToken: retrieveStringFromStorage("TokenAuthorization"),
            refreshToken: retrieveStringFromStorage("RefreshAuthorization"),
            expiresIn: moment(retrieveStringFromStorage("ExpirationAuthorization"), 'yyyy-MM-dd  hh:mm:ss').toDate()
          });

          this.currentUserSubject = new BehaviorSubject<UserModel>(response.data);
         
        } else {
          
          this.logout();
          
        }
        
        return response;
      }),
      catchError(this.handleError),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    sessionStorage.removeItem('user');
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<ApiResponse<UserModel>> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this._authHttpService.getUserByToken().pipe(
      map((_response: ApiResponse<UserModel>) => {
        if (_response.success) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(_response.data);
        } else {
          this.logout();
        }
        return _response;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // private methods
  private setAuthFromLocalStorage(auth): boolean {
    if (auth) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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
