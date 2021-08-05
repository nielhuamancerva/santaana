import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomersService } from '../../../e-commerce/_services/';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter,NgbDate,NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-ticket-payments',
  templateUrl: './ticket-payments.component.html',
  styleUrls: ['./ticket-payments.component.scss']
  
})
export class TicketPaymentsComponent implements OnInit

  {   formGroup: FormGroup; 
    public isCollapsed = false;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = [];
  constructor(private fb: FormBuilder,
    public customerService: CustomersService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
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
    this.customerService.patchState({ searchTerm });
  }

  
    // helpers for View
    isControlValid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.valid && (control.dirty || control.touched);
    }
  
    isControlInvalid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.invalid && (control.dirty || control.touched);
    }
  
    controlHasError(validation: string, controlName: string) {
      const control = this.formGroup.controls[controlName];
      return control.hasError(validation) && (control.dirty || control.touched);
    }
  
    isControlTouched(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.dirty || control.touched;
    }
}
