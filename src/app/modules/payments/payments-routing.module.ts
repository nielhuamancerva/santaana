import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NewPaymentComponent } from './components/new-payment/new-payment.component';
const routes: Routes = [
  {
    path: '',
    component: NewPaymentComponent,
  },
  {
    path: 'new',
    component: NewPaymentComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
 
})
export class PaymentsRoutingModule { }
