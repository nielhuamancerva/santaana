import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
import { UserRepositoryService } from '../../_services-repository/user-repository.service';
import { UserModel } from '../../../auth';

@Component({
    selector: 'edit-asign-internal-user',
    templateUrl: './edit-asign-internal-user.component.html'
})

export class EditAsignInternalUserComponent implements OnInit {
    $_user:UserModel;
    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(    
        private userService: UserRepositoryService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        public productsService: ProductsService
    ) { }
  
    ngOnInit(): void {
        this.loadUser();
        this.filterForm();
        this.searchForm();
        this.productsService.fetch();
        const sb = this.productsService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
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
        const sbUser = this.userService.getAllUser().pipe(
            catchError((errorMessage) => {
            return of(errorMessage);
            })
        ).subscribe((_user) => {
    
            this.$_user = _user;
            console.log(this.$_user);
        });
        this.subscriptions.push(sbUser);
  }
}  