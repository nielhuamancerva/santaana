import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
} from '../../../_metronic/shared/crud-table';
import { EditUserModalComponent} from './components/edit-user-modal/edit-user-modal.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  isLoading: boolean;
  
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(    private fb: FormBuilder,private modalService: NgbModal) { }

  ngOnInit(): void {

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
}
