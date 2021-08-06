import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule, Router } from '@angular/router';
import {PaymentManagementComponent} from './payment-management.component';
import {PaymentComponent} from './payment/payment.component';
import { PaymentEditComponent } from './payment/payment-edit/payment-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentManagementComponent,
    children: [
      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: 'payment/list',
        component: PaymentEditComponent
      },
      { path: '', redirectTo: 'payment', pathMatch: 'full' },
      { path: '**', redirectTo: 'payment', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class PaymentManagementRoutingModule { }
