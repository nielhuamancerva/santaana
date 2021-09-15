import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/_commons/_models/api-response.model';
import { PagedResponse } from 'src/app/_commons/_models/paged-response.model';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { UserDomainService } from '../_domain/user-domain.service';
import { UserModel } from '../_models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends TableService<UserModel> implements OnDestroy {

    constructor(@Inject(HttpClient) http, private _userservicedomain: UserDomainService) {
        super(http);
      }

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<UserModel>> {
        let page = tableState.paginator.page -1;
        let size = tableState.paginator.pageSize;
        let docnum = tableState.searchTerm;
        let name = tableState.searchAux1;
        let state = tableState.filter['state'];
    

        return this._userservicedomain.getInternalUsers(page , size, docnum, name, state, "USERINT").pipe(
        map(
        response => {
            let result: TableResponseModel<UserModel> = {
                items: response.data.content,
                total: response.data.totalElements,
                lenght: response.data.content.length
            };
            
            return result;
        }
        ));    
    }

    register(_data: FormData, hasher: string) : Observable<ApiResponse<UserModel>>{
        return this._userservicedomain.createUser(_data, hasher);      
    }

    updater(_data: FormData, userId: string) : Observable<ApiResponse<UserModel>>{
        return this._userservicedomain.updateUser(_data, userId);      
    }

    changeHasherRoot(id: string, hasher: string, _user: UserModel) : Observable<ApiResponse<UserModel>>{
        return this._userservicedomain.changeHasherRoot(id, hasher, _user);      
    }

    enableDisabled(id: string, _user: UserModel) : Observable<ApiResponse<UserModel>>{
        return this._userservicedomain.enableDisabled(id, _user);      
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


    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
      }
}