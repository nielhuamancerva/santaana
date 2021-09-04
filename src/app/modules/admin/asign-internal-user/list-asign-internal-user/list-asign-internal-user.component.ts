import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, map } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

import { UserRepositoryService } from '../../_services-repository/user-repository.service';
import { UserHTTPServiceDomain } from '../../_services/user-domain.service';
import { DepartamentModel } from '../../_models/Departament.model';

@Component({
    selector: 'list-asign-internal-user',
    templateUrl: './list-asign-internal-user.component.html'
})

export class ListAsignInternalUserComponent implements OnInit {
    $_ubigee: Observable<DepartamentModel[]>;
    isLoading: boolean;
    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: NgbModal,
        public asignInternalUserServiceDomain: UserHTTPServiceDomain,
        public userService: UserRepositoryService
    ) { }
  
    ngOnInit(): void {
        const sb = this.asignInternalUserServiceDomain.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
        this.asignInternalUserServiceDomain.fetch();
    }
  
    loadAsignInternalUser(){
        this.isLoading = true;
        this.$_ubigee = this.userService.getAllAsignInternalUser().pipe(
            map((_asign)=>_asign.content,
            finalize(()=>this.isLoading=false)
            )
        )
    }
}  