import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

import { DepartamentModel } from '../_models/Departament.model';
import { UbigeoService } from '../_services/ubigeo.service';
import { UbigeoHTTPServiceDomain } from '../_domain/ubigeo-domain.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';

@Component({
    selector: 'ubigeo',
    templateUrl: './ubigeo.component.html'
})

export class UbigeoComponent implements OnInit {
    $_ubigee: Observable<DepartamentModel[]>;
    isLoading: boolean;
    searchGroup: FormGroup;
    paginator: PaginatorState;
    private subscriptions: Subscription[] = [];
    constructor(
        private fb: FormBuilder,
        public asignInternalServiceDomain: UbigeoHTTPServiceDomain,
        public _ubigeoService: UbigeoService,

    ) { }
  
    ngOnInit(): void {
        this.searchForm();
        this._ubigeoService.fetch();
        this.paginator = this._ubigeoService.paginator;
        const sb = this._ubigeoService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            user: [''],
        });

        const searchUser = this.searchGroup.controls.user.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.searchUser(val));
            
        this.subscriptions.push(searchUser);
    }

    searchUser(searchTerm: string) {
        this._ubigeoService.patchState({ searchTerm });
    }

    paginate(paginator: PaginatorState) {
        this._ubigeoService.patchState({ paginator });
    }
}  