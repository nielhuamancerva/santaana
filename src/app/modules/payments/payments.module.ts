import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NewPaymentComponent} from './components/new-payment/new-payment.component'
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentsRoutingModule } from './payments-routing.module';
import { TicketPaymentsComponent } from './components/ticket-payments/ticket-payments.component';
@NgModule({
  declarations: [NewPaymentComponent, TicketPaymentsComponent],
  imports: [
    CommonModule,HttpClientModule,InlineSVGModule,CRUDTableModule,FormsModule,ReactiveFormsModule,PaymentsRoutingModule
  ]
})
export class PaymentsModule { }
