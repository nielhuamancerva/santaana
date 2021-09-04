import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import {
    GroupingState,
    PaginatorState,
    SortState
} from '../../../../_metronic/shared/crud-table';

import { ProductsService } from '../../../e-commerce/_services';
import { DeleteProductModalComponent } from '../../../e-commerce/products/components/delete-product-modal/delete-product-modal.component';
import { DeleteProductsModalComponent } from '../../../e-commerce/products/components/delete-products-modal/delete-products-modal.component';
import { UpdateProductsStatusModalComponent } from '../../../e-commerce/products/components/update-products-status-modal/update-products-status-modal.component';
import { FetchProductsModalComponent } from '../../../e-commerce/products/components/fetch-products-modal/fetch-products-modal.component';
import { UserModel } from '../../../auth';
import { AsignRepositoryService } from '../../_services-repository/asign-repository.service';
import { UserAsignHTTPServiceDomain } from '../../_services/asign-domain.service';


@Component({
    selector: 'list-asign-internal-user',
    templateUrl: './list-asign-internal-user.component.html'
})

export class ListAsignInternalUserComponent implements OnInit {
    $_user:any;
    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(    
        private fb: FormBuilder,
        private modalService: NgbModal,
        private productsService: ProductsService,
        private asignUserService:AsignRepositoryService,
        private asignUserServiceDomain:UserAsignHTTPServiceDomain,
    ) { }
  
    ngOnInit(): void {
        this.loadUser();
        this.filterForm();
        this.searchForm();

 
        this.grouping = this.productsService.grouping;
        this.paginator = this.productsService.paginator;
        this.sorting = this.productsService.sorting;
    }
  
    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
  
    filterForm() {
        this.filterGroup = this.fb.group({
            status: [''],
            type: [''],
            searchTerm: [''],
        });
        this.subscriptions.push(
            this.filterGroup.controls.status.valueChanges.subscribe(() =>
            this.filter()
            )
        );
        this.subscriptions.push(
            this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
        );
    }
  
    filter() {
        const filter = {};
        const status = this.filterGroup.get('status').value;
        if (status) {
            filter['status'] = status;
        }
    
        const type = this.filterGroup.get('type').value;
        if (type) {
            filter['type'] = type;
        }
    }
  
    searchForm() {
        this.searchGroup = this.fb.group({
            searchTerm: [''],
        });
        const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
            .pipe(
            debounceTime(150),
            distinctUntilChanged()
            )
            .subscribe((val) => this.search(val));
        this.subscriptions.push(searchEvent);
    }
  
    search(searchTerm: string) {
        this.productsService.patchState({ searchTerm });
    }
  
    sort(column: string) {
        const sorting = this.sorting;
        const isActiveColumn = sorting.column === column;
        if (!isActiveColumn) {
            sorting.column = column;
            sorting.direction = 'asc';
        } else {
            sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
        }
        this.productsService.patchState({ sorting });
    }

    paginate(paginator: PaginatorState) {
        this.productsService.patchState({ paginator });
    }
  
    delete(id: number) {
        const modalRef = this.modalService.open(DeleteProductModalComponent);
        modalRef.componentInstance.id = id;
        modalRef.result.then(
            () => this.productsService.fetch(),
            () => { }
        );
    }
  
    deleteSelected() {
        const modalRef = this.modalService.open(DeleteProductsModalComponent);
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(
            () => this.productsService.fetch(),
            () => { }
        );
    }
  
    updateStatusForSelected() {
        const modalRef = this.modalService.open(
            UpdateProductsStatusModalComponent
        );
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(
            () => this.productsService.fetch(),
            () => { }
        );
    }
  
    fetchSelected() {
        const modalRef = this.modalService.open(FetchProductsModalComponent);
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(
            () => this.productsService.fetch(),
            () => { }
        );
    }

    loadUser(){
            this.isLoading=true;
            this.$_user=this.asignUserServiceDomain.getAllUserAsign().pipe(
            map((_beneficiary)=>_beneficiary.data,
            finalize(()=>this.isLoading=false)
            )
        )

        // const sbDepartament = this.asignUserServiceDomain.getAllUserAsign().pipe(
        //     catchError((errorMessage) => {
        //     return of(errorMessage);
        //     })
        // ).subscribe((_asignacion) => {
        //     this.$_user = _asignacion;
       
        //     console.log(this.$_user);
        // });
        // this.subscriptions.push(sbDepartament);

  }
}  