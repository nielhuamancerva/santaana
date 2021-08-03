import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserModalComponent} from '../edit-user-modal/edit-user-modal.component';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../../_metronic/shared/crud-table';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements   OnInit,
IGroupingView{
  
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/


  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

 // sorting
 sort(column: string) {
  const sorting = this.sorting;
  const isActiveColumn = sorting.column === column;
  if (!isActiveColumn) {
    sorting.column = column;
    sorting.direction = 'asc';
  } else {
    sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
  }
  //this.customerService.patchState({ sorting });
}

  // pagination
  paginate(paginator: PaginatorState) {
  //  this.customerService.patchState({ paginator });
  }

  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditUserModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
     // this.customerService.fetch(),
      () => { }
    );
  }

}
