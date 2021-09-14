import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, map } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

import { DepartamentModel } from '../../_models/Departament.model';
import { AsignRepositoryService } from '../../_services-repository/asign-repository.service';
import { UserAsignHTTPServiceDomain } from '../../_services/asign-domain.service';

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
        public asignInternalServiceDomain: UserAsignHTTPServiceDomain,
        public asignInternalUserService: AsignRepositoryService,

    ) { }
  
    ngOnInit(): void {
        this.loadAsignInternalUser()
        this.asignInternalServiceDomain.fetch();
        const sb = this.asignInternalServiceDomain.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
        this.asignInternalServiceDomain.fetch();
    }
  
    loadAsignInternalUser(){
        this.isLoading = true;
        this.$_ubigee = this.asignInternalUserService.getAllUserAsign().pipe(
            map((_asign)=>_asign,
            finalize(()=>this.isLoading=false)
            )
        )
    }
}  