import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LayoutService } from '../../../../_metronic/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketPaymentsComponent } from '../ticket-payments/ticket-payments.component';
@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss']
})
export class NewPaymentComponent implements OnInit {
  toppings = new FormControl();
  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

;
  formGroup: FormGroup;
  
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    REMARKS_TAB: 1,
    SPECIFICATIONS_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];
  constructor(private layout: LayoutService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.isLoading$ = this.isLoading$;

    
  }

  save() {

    }

    create() {
      this.edit(undefined);
    }
  
    edit(id: number) {
      const modalRef = this.modalService.open(TicketPaymentsComponent);
      modalRef.componentInstance.id = id;
      modalRef.result.then(() =>
     //   this.customerService.fetch(),
        () => { }
      );
    }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
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
