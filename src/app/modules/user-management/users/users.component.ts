import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../../e-commerce/_services';

import {
  GroupingState,
  PaginatorState,
  SortState,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView
} from '../../../_metronic/shared/crud-table';
import { EditUserModalComponent} from './components/edit-user-modal/edit-user-modal.component';
import { DeleteProductModalComponent } from '../../e-commerce/products/components/delete-product-modal/delete-product-modal.component';
import { DeleteProductsModalComponent } from '../../e-commerce/products/components/delete-products-modal/delete-products-modal.component';
import { UpdateProductsStatusModalComponent } from '../../e-commerce/products/components/update-products-status-modal/update-products-status-modal.component';
import { FetchProductsModalComponent } from '../../e-commerce/products/components/fetch-products-modal/fetch-products-modal.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
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
    public productsService: ProductsService
    ) { }

  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.productsService.fetch();
    const sb = this.productsService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.productsService.grouping;
    this.paginator = this.productsService.paginator;
    this.sorting = this.productsService.sorting;
    this.productsService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

// filtration
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
  //  this.customerService.patchState({ filter });
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
  The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
  we are limiting the amount of server requests emitted to a maximum of one every 150ms
  */
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

  // pagination
  paginate(paginator: PaginatorState) {
    this.productsService.patchState({ paginator });
  }


  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditUserModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
 //  modalRef.result.then(() =>
   // this.customerService.fetch(),
    //  () => { }
  // );
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
}
