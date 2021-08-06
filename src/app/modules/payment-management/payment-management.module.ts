import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { PaymentManagementComponent } from './payment-management.component';
import {PaymentManagementRoutingModule} from './payment-management-routing.module'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketPaymentModalComponent } from './payment/components/ticket-payment-modal/ticket-payment-modal.component';
import { PaymentEditComponent } from './payment/payment-edit/payment-edit.component';

@NgModule({
  declarations: [PaymentManagementComponent, PaymentComponent, TicketPaymentModalComponent, PaymentEditComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule, 
    PaymentManagementRoutingModule
  ],
  entryComponents: [
    TicketPaymentModalComponent
  ]
})
export class PaymentManagementModule { }
